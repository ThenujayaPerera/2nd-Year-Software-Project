package com.example.back_end.service;

import com.example.back_end.entity.Order;
import com.example.back_end.entity.OrderItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${resend.from.email:noreply@nvs-shop.com}")
    private String fromEmail;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOtpEmail(String toEmail, String otp) {
        if (!StringUtils.hasText(resendApiKey) && (smtpUsername == null || smtpUsername.contains("example.com") || smtpUsername.isBlank())) {
            log.info("DEV OTP for {}: {}", toEmail, otp);
            return;
        }

        try {
            if (StringUtils.hasText(resendApiKey)) {
                if (sendWithResend(toEmail, "NV-SHOP Email Verification OTP", buildHtmlBody(otp))) {
                    return;
                }
            }

            sendWithSmtp(toEmail, "NV-SHOP Email Verification OTP", buildTextBody(otp));
        } catch (Exception ex) {
            log.error("Failed to send OTP email to {}: {}", toEmail, ex.getMessage(), ex);
            throw new RuntimeException("Unable to send OTP email. Please try again later.");
        }
    }

    public void sendOrderConfirmationEmail(Order order) {
        if (!StringUtils.hasText(resendApiKey) && (smtpUsername == null || smtpUsername.contains("example.com") || smtpUsername.isBlank())) {
            log.info("DEV ORDER CONFIRMATION for {} - Order #: {}", order.getUserEmail(), order.getOrderNumber());
            return;
        }

        try {
            String subject = "Order Confirmed #" + order.getOrderNumber() + " - NVSHOP.LK";
            StringBuilder itemsHtml = new StringBuilder();
            StringBuilder itemsText = new StringBuilder();

            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    itemsHtml.append(String.format(
                            "<tr><td style='padding:8px;border-bottom:1px solid #e2e8f0;'>%s (x%d)</td>" +
                            "<td style='padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;'>LKR %,.2f</td></tr>",
                            item.getProductName(), item.getQuantity(), item.getSubtotal()
                    ));
                    itemsText.append(String.format("• %s x%d - LKR %,.2f\n", item.getProductName(), item.getQuantity(), item.getSubtotal()));
                }
            }

            String html = String.format(
                    "<div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;'>" +
                    "<div style='background:#2563eb;color:white;padding:20px;border-radius:8px;text-align:center;'>" +
                    "<h1 style='margin:0;font-size:24px;'>NVSHOP.LK</h1>" +
                    "<p style='margin:5px 0 0 0;'>Thank you for your order!</p>" +
                    "</div>" +
                    "<div style='padding:20px 0;'>" +
                    "<h3 style='color:#0f172a;'>Order Details: %s</h3>" +
                    "<p><strong>Recipient:</strong> %s (%s)</p>" +
                    "<p><strong>Delivery Address:</strong> %s, %s</p>" +
                    "<p><strong>Payment Method:</strong> %s (%s)</p>" +
                    "<table style='width:100%%;border-collapse:collapse;margin:20px 0;'>" +
                    "<thead><tr style='background:#f8fafc;'><th style='padding:8px;text-align:left;'>Item</th><th style='padding:8px;text-align:right;'>Total</th></tr></thead>" +
                    "<tbody>%s</tbody>" +
                    "</table>" +
                    "<div style='text-align:right;font-size:18px;font-weight:bold;color:#2563eb;'>" +
                    "Grand Total: LKR %,.2f" +
                    "</div>" +
                    "</div>" +
                    "<div style='background:#f8fafc;padding:15px;border-radius:8px;font-size:13px;color:#64748b;text-align:center;'>" +
                    "Our courier will deliver your package in 1-3 business days. For support, WhatsApp +94 76 989 0079." +
                    "</div>" +
                    "</div>",
                    order.getOrderNumber(), order.getCustomerName(), order.getCustomerPhone(),
                    order.getShippingAddress(), order.getCity() != null ? order.getCity() : "",
                    order.getPaymentMethod(), order.getPaymentStatus(),
                    itemsHtml.toString(), order.getTotalAmount()
            );

            if (StringUtils.hasText(resendApiKey)) {
                if (sendWithResend(order.getUserEmail(), subject, html)) {
                    return;
                }
            }

            String textBody = String.format(
                    "Thank you for shopping with NVSHOP.LK!\n\n" +
                    "Order Number: %s\n" +
                    "Customer: %s (%s)\n" +
                    "Address: %s\n" +
                    "Payment: %s\n\n" +
                    "Items:\n%s\n" +
                    "Total: LKR %,.2f\n\n" +
                    "Your order is being processed for express island-wide delivery.\n" +
                    "NVSHOP.LK Support: +94 76 989 0079",
                    order.getOrderNumber(), order.getCustomerName(), order.getCustomerPhone(),
                    order.getShippingAddress(), order.getPaymentMethod(),
                    itemsText.toString(), order.getTotalAmount()
            );

            sendWithSmtp(order.getUserEmail(), subject, textBody);
        } catch (Exception ex) {
            log.warn("Failed to send order confirmation email to {}: {}", order.getUserEmail(), ex.getMessage());
        }
    }

    private boolean sendWithResend(String toEmail, String subject, String html) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(resendApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = Map.of(
                    "from", fromEmail,
                    "to", List.of(toEmail),
                    "subject", subject,
                    "html", html
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            var response = restTemplate.postForEntity("https://api.resend.com/emails", request, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email [{}] sent to {} via Resend", subject, toEmail);
                return true;
            }

            log.warn("Resend rejected email for {} with status {}", toEmail, response.getStatusCode());
            return false;
        } catch (Exception ex) {
            log.warn("Resend delivery failed for {}: {}", toEmail, ex.getMessage());
            return false;
        }
    }

    private void sendWithSmtp(String toEmail, String subject, String textBody) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(textBody);
        mailSender.send(message);
        log.info("Email [{}] sent to {} via SMTP", subject, toEmail);
    }

    private String buildTextBody(String otp) {
        return String.format(
                "Welcome to NV-SHOP!\n\n" +
                        "Your verification code is: %s\n\n" +
                        "Enter this code in the app to complete your registration.\n\n" +
                        "If you did not request this, please ignore this message.",
                otp
        );
    }

    private String buildHtmlBody(String otp) {
        return String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;'>" +
                        "<h2 style='color: #0f172a;'>Welcome to NV-SHOP</h2>" +
                        "<p>Thanks for signing up. Use the verification code below to complete your registration.</p>" +
                        "<div style='margin: 24px 0; padding: 16px 20px; background: #f8fafc; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 4px; text-align: center;'>%s</div>" +
                        "<p>If you did not request this, please ignore this message.</p>" +
                        "</div>",
                otp
        );
    }
}
