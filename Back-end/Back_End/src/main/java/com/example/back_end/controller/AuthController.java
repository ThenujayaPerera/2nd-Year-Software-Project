package com.example.back_end.controller;

import com.example.back_end.dto.AuthResponseDTO;
import com.example.back_end.dto.LoginRequestDTO;
import com.example.back_end.dto.OtpResponseDTO;
import com.example.back_end.dto.OtpVerifyDTO;
import com.example.back_end.dto.UserCreateDTO;
import com.example.back_end.service.MailService;
import com.example.back_end.service.OtpService;
import com.example.back_end.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    /**
     * Register a new user (Step 1: Save unverified user & send OTP to email)
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<OtpResponseDTO> register(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        log.info("Register request for email: {}", userCreateDTO.getEmail());
        userService.createUser(userCreateDTO);
        String otp = otpService.generateOtp(userCreateDTO.getEmail());
        mailService.sendOtpEmail(userCreateDTO.getEmail(), otp);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new OtpResponseDTO(userCreateDTO.getEmail(), "OTP sent to email. Verify to complete registration."));
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
