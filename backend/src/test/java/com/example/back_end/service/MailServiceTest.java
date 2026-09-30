package com.example.back_end.service;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class MailServiceTest {

    @Test
    void sendOtpEmail_shouldFallbackToSmtpWhenResendIsNotConfigured() {
        MailService mailService = new MailService();
        JavaMailSender mailSender = mock(JavaMailSender.class);

        ReflectionTestUtils.setField(mailService, "mailSender", mailSender);
        ReflectionTestUtils.setField(mailService, "resendApiKey", "");
        ReflectionTestUtils.setField(mailService, "fromEmail", "");

        mailService.sendOtpEmail("user@example.com", "123456");

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage message = captor.getValue();
        assertEquals("NV-SHOP Email Verification OTP", message.getSubject());
        assertEquals("user@example.com", message.getTo()[0]);
    }
}
