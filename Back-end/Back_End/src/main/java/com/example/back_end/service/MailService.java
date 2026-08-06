package com.example.back_end.service;

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
        // Local dev shortcut: when Resend is not configured and SMTP username looks like the placeholder
        // log the OTP to console so the signup flow can be tested without sending real emails.
        if (!StringUtils.hasText(resendApiKey) && (smtpUsername == null || smtpUsername.contains("example.com") || smtpUsername.isBlank())) {
            log.info("DEV OTP for {}: {}", toEmail, otp);
            return;
        }

        try {
            if (StringUtils.hasText(resendApiKey)) {
                if (sendWithResend(toEmail, otp)) {
                    return;
                }
            }

            sendWithSmtp(toEmail, otp);
        } catch (Exception ex) {
            log.error("Failed to send OTP email to {}: {}", toEmail, ex.getMessage(), ex);
            throw new RuntimeException("Unable to send OTP email. Please try again later.");
        }
    }

    private boolean sendWithResend(String toEmail, String otp) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(resendApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            String html = buildHtmlBody(otp);
            log.debug("Resend HTML payload for {}: {}", toEmail, html);

            Map<String, Object> payload = Map.of(
                "from", fromEmail,
                "to", List.of(toEmail),
                "subject", "NV-SHOP Email Verification OTP",
                "html", html
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            var response = restTemplate.postForEntity("https://api.resend.com/emails", request, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("OTP email sent to {} via Resend", toEmail);
                return true;
            }

            log.warn("Resend rejected OTP email for {} with status {}", toEmail, response.getStatusCode());
            return false;
        } catch (Exception ex) {
            log.warn("Resend delivery failed for {}: {}", toEmail, ex.getMessage());
            return false;
        }
    }

    private void sendWithSmtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("NV-SHOP Email Verification OTP");
        message.setText(buildTextBody(otp));
        mailSender.send(message);
        log.info("OTP email sent to {} via SMTP fallback", toEmail);
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
