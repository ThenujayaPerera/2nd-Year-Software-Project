package com.example.back_end.controller;

import com.example.back_end.dto.AuthResponseDTO;
import com.example.back_end.dto.LoginRequestDTO;
import com.example.back_end.dto.OtpResponseDTO;
import com.example.back_end.dto.OtpVerifyDTO;
import com.example.back_end.dto.UserCreateDTO;
import com.example.back_end.service.MailService;
import com.example.back_end.service.OtpService;
import com.example.back_end.service.SmsService;
import com.example.back_end.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private MailService mailService;

    @Autowired
    private SmsService smsService;

    /**
     * Register a new user (Step 1: Save unverified user & send OTP to Email & Mobile Phone)
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<OtpResponseDTO> register(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        log.info("Register request for email: {} and phone: {}", userCreateDTO.getEmail(), userCreateDTO.getPhone());
        userService.createUser(userCreateDTO);
        
        // Generate secure 6-digit OTP
        String otp = otpService.generateOtp(userCreateDTO.getEmail());

        // Send Email OTP
        try {
            mailService.sendOtpEmail(userCreateDTO.getEmail(), otp);
        } catch (Exception e) {
            log.warn("Email OTP failed: {}", e.getMessage());
        }

        // Send Phone SMS OTP if phone number is provided
        if (StringUtils.hasText(userCreateDTO.getPhone())) {
            try {
                smsService.sendOtpSms(userCreateDTO.getPhone(), otp);
            } catch (Exception e) {
                log.warn("Phone SMS OTP failed: {}", e.getMessage());
            }
        }

        String msg = StringUtils.hasText(userCreateDTO.getPhone())
                ? "OTP verification code sent to your Mobile Phone and Email."
                : "OTP sent to your email address.";

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new OtpResponseDTO(userCreateDTO.getEmail(), msg));
    }

    /**
     * Verify Register OTP (Step 2: Activate account & return Auth Token)
     * POST /api/auth/register/verify
     */
    @PostMapping("/register/verify")
    public ResponseEntity<AuthResponseDTO> verifyRegisterOtp(@Valid @RequestBody OtpVerifyDTO otpVerifyDTO) {
        log.info("Verify registration OTP request for email: {}", otpVerifyDTO.getEmail());
        boolean valid = otpService.validateOtp(otpVerifyDTO.getEmail(), otpVerifyDTO.getOtp());
        if (!valid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        AuthResponseDTO authResponse = userService.authenticateAfterOtp(otpVerifyDTO.getEmail());
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Resend OTP to Phone & Email
     * POST /api/auth/resend-otp
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<Map<String, String>> resendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String phone = body.get("phone");

        if (!StringUtils.hasText(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        String otp = otpService.generateOtp(email);
        try {
            mailService.sendOtpEmail(email, otp);
        } catch (Exception ignored) {}

        if (StringUtils.hasText(phone)) {
            try {
                smsService.sendOtpSms(phone, otp);
            } catch (Exception ignored) {}
        }

        return ResponseEntity.ok(Map.of("message", "New OTP code sent to your phone and email."));
    }

    /**
     * Direct Login (Email + Password -> Instant Auth Token)
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        log.info("Direct login request for email: {}", loginRequestDTO.getEmail());
        AuthResponseDTO authResponse = userService.authenticate(loginRequestDTO);
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
