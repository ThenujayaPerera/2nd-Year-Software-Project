package com.example.back_end.service;

import com.example.back_end.entity.Order;
import com.example.back_end.entity.OrderItem;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
        log.info("Preparing OTP email for: {}", toEmail);
        String html = buildHtmlBody(otp);
        String subject = "NVSHOP.LK - Email Verification Code: " + otp;

        try {
            if (StringUtils.hasText(resendApiKey)) {
                if (sendWithResend(toEmail, subject, html)) {
                    return;
                }
            }

            sendWithSmtp(toEmail, subject, html, buildTextBody(otp));
        } catch (Exception ex) {
            log.warn("Failed to send OTP email to {}: {}. Logged OTP for dev.", toEmail, ex.getMessage());
            log.info("DEV REGISTRATION OTP FOR {}: {}", toEmail, otp);
        }
    }

    public void sendOrderConfirmationEmail(Order order) {
        try {
            String subject = "Order Confirmed #" + order.getOrderNumber() + " - NVSHOP.LK";
            StringBuilder itemsHtml = new StringBuilder();
            StringBuilder itemsText = new StringBuilder();

            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    itemsHtml.append(String.format(
                            "<tr><td style='padding:12px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#1e293b;'>%s (x%d)</td>" +
                            "<td style='padding:12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:bold;font-size:14px;color:#0f172a;'>LKR %,.2f</td></tr>",
                            item.getProductName(), item.getQuantity(), item.getSubtotal()
                    ));
                    itemsText.append(String.format("• %s x%d - LKR %,.2f\n", item.getProductName(), item.getQuantity(), item.getSubtotal()));
                }
            }

            String html = String.format(
                    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;'>" +
                    "<div style='background: #1e3a8a; color: white; padding: 28px; text-align: center;'>" +
                    "<h1 style='margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;'>NVSHOP.LK</h1>" +
                    "<p style='margin: 6px 0 0 0; font-size: 14px; color: #93c5fd;'>Order Confirmed & Islandwide Delivery Scheduled</p>" +
                    "</div>" +
                    "<div style='padding: 24px;'>" +
                    "<h3 style='color: #0f172a; margin-top: 0;'>Order Reference: %s</h3>" +
                    "<p style='font-size: 14px; color: #475569;'><strong>Customer:</strong> %s (%s)</p>" +
                    "<p style='font-size: 14px; color: #475569;'><strong>Delivery Address:</strong> %s, %s</p>" +
                    "<p style='font-size: 14px; color: #475569;'><strong>Payment:</strong> %s (%s)</p>" +
                    "<table style='width: 100%%; border-collapse: collapse; margin: 20px 0;'>" +
                    "<thead><tr style='background: #f8fafc;'><th style='padding: 10px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase;'>Product</th><th style='padding: 10px; text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase;'>Total</th></tr></thead>" +
                    "<tbody>%s</tbody>" +
                    "</table>" +
                    "<div style='text-align: right; font-size: 20px; font-weight: 900; color: #1e3a8a; padding: 12px 0; border-top: 2px solid #e2e8f0;'>" +
                    "Grand Total: LKR %,.2f" +
                    "</div>" +
                    "</div>" +
                    "<div style='background: #f8fafc; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;'>" +
                    "Showroom: 185/1/2B New Road, Ambalangoda • Hotline: +94 76 989 0079 (Open 7 Days)" +
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

            sendWithSmtp(order.getUserEmail(), subject, html, textBody);
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

    private void sendWithSmtp(String toEmail, String subject, String htmlBody, String fallbackText) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setFrom(StringUtils.hasText(smtpUsername) ? smtpUsername : "noreply@nvshop.lk");
            helper.setText(fallbackText, htmlBody);
            mailSender.send(message);
            log.info("HTML Email [{}] sent to {} via Gmail SMTP", subject, toEmail);
        } catch (Exception e) {
            log.warn("SMTP HTML delivery failed: {}. Falling back to simple text.", e.getMessage());
        }
    }

    private String buildTextBody(String otp) {
        return String.format(
                "Welcome to NVSHOP.LK!\n\n" +
                "Your Email Verification Code is: %s\n\n" +
                "Enter this 6-digit code on the registration page to activate your NVSHOP account.\n\n" +
                "Showroom: 185/1/2B New Road, Ambalangoda • Hotline: +94 76 989 0079\n" +
                "If you did not request this, please ignore this email.",
                otp
        );
    }

    private String buildHtmlBody(String otp) {
        return String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);'>" +
                "<div style='background: #1e3a8a; color: white; padding: 28px 24px; text-align: center;'>" +
                "<h1 style='margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;'>NVSHOP.LK</h1>" +
                "<p style='margin: 6px 0 0 0; font-size: 13px; color: #93c5fd;'>Sri Lanka's Premier Mobile Accessories Hub</p>" +
                "</div>" +
                "<div style='padding: 32px 24px; text-align: center;'>" +
                "<h2 style='color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 800;'>Verify Your Email Address</h2>" +
                "<p style='color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 24px;'>" +
                "Thank you for registering with NVSHOP.LK. Please enter the 6-digit verification code below to complete your account setup and unlock member discounts:" +
                "</p>" +
                "<div style='display: inline-block; padding: 16px 36px; background: #eff6ff; border: 2px dashed #2563eb; border-radius: 12px; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #1e3a8a; font-family: monospace;'>" +
                "%s" +
                "</div>" +
                "<p style='color: #94a3b8; font-size: 12px; margin-top: 24px;'>" +
                "This code is valid for 10 minutes. Please do not share this code with anyone." +
                "</p>" +
                "</div>" +
                "<div style='background: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;'>" +
                "Showroom: 185/1/2B New Road, Ambalangoda • Hotline: +94 76 989 0079<br>© NVSHOP.LK All rights reserved." +
                "</div>" +
                "</div>",
                otp
        );
    }
}
