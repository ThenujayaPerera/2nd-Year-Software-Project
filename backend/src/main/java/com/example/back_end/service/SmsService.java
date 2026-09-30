package com.example.back_end.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class SmsService {

    @Value("${sms.user.id:}")
    private String userId;

    @Value("${sms.api.key:}")
    private String smsApiKey;

    @Value("${sms.sender.id:NotifyDEMO}")
    private String senderId;

    @Value("${sms.provider.url:https://app.notify.lk/api/v1/send}")
    private String smsProviderUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendOtpSms(String phoneNumber, String otp) {
        String formattedPhone = formatSriLankanPhoneNumber(phoneNumber);
        String messageBody = String.format("Your NVSHOP.LK verification code is: %s. Valid for 5 minutes. Do not share this code.", otp);

        log.info("=================================================");
        log.info("📱 [NOTIFY.LK SMS GATEWAY] Dispatching to {}: Code = {}", formattedPhone, otp);
        log.info("📱 Sender: {}, User ID: {}", senderId, userId);
        log.info("=================================================");

        if (!StringUtils.hasText(smsApiKey) || "YOUR_NOTIFY_LK_API_KEY".equalsIgnoreCase(smsApiKey)) {
            log.info("Dev Mode: Simulated SMS delivery to {} successful.", formattedPhone);
            return true;
        }

        try {
            // Notify.lk HTTP API v1 payload
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("user_id", userId);
            map.add("api_key", smsApiKey);
            map.add("sender_id", senderId);
            map.add("to", formattedPhone);
            map.add("message", messageBody);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(smsProviderUrl, request, String.class);

            log.info("Notify.lk Gateway Response Status: {}, Body: {}", response.getStatusCode(), response.getBody());
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception ex) {
            log.warn("Notify.lk API call failed for {}: {}. Code was logged for fallback.", formattedPhone, ex.getMessage());
            return true; // Keep registration responsive
        }
    }

    private String formatSriLankanPhoneNumber(String phone) {
        if (phone == null) return "";
        String cleaned = phone.replaceAll("[^0-9]", "");
        if (cleaned.startsWith("94") && cleaned.length() == 11) {
            return cleaned;
        }
        if (cleaned.startsWith("0") && cleaned.length() == 10) {
            return "94" + cleaned.substring(1);
        }
        if (cleaned.length() == 9) {
            return "94" + cleaned;
        }
        return cleaned;
    }
}
