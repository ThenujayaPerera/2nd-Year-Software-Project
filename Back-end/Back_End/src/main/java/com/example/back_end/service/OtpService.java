package com.example.back_end.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
public class OtpService {
    private final Map<String, OtpEntry> otpStore = new HashMap<>();
    private final Random random = new Random();
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;

    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        otpStore.put(email, new OtpEntry(otp, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES)));
        log.info("Generated OTP for {}", email);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null) {
            return false;
        }
        if (entry.getExpiry().isBefore(LocalDateTime.now())) {
            otpStore.remove(email);
            return false;
        }
        boolean isValid = entry.getOtp().equals(otp);
        if (isValid) {
            otpStore.remove(email);
        }
        return isValid;
    }

    public void removeOtp(String email) {
        otpStore.remove(email);
    }

    private static class OtpEntry {
        private final String otp;
        private final LocalDateTime expiry;

        public OtpEntry(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiry() {
            return expiry;
        }
    }
}
