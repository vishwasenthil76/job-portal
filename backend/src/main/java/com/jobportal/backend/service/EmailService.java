package com.jobportal.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendApplicationConfirmation(String to, String name, String jobTitle) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Application Submitted — " + jobTitle);
            message.setText(
                "Hi " + name + ",\n\n" +
                "Your application has been successfully submitted for the position:\n\n" +
                "  " + jobTitle + "\n\n" +
                "We'll keep you updated on the status of your application.\n\n" +
                "Best regards,\nJob Portal Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send confirmation email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendStatusUpdate(String to, String name, String jobTitle, String status) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Application Update — " + jobTitle);
            message.setText(
                "Hi " + name + ",\n\n" +
                "Your application for \"" + jobTitle + "\" has been updated.\n\n" +
                "Current Status: " + formatStatus(status) + "\n\n" +
                "Log in to Job Portal to view more details.\n\n" +
                "Best regards,\nJob Portal Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send status email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Password Reset Request");
            message.setText(
                "A password reset was requested for your Job Portal account.\n\n" +
                "Use this token to reset your password: " + resetToken + "\n\n" +
                "This token expires in 30 minutes.\n\n" +
                "If you didn't request this, please ignore this email."
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", to, e.getMessage());
        }
    }

    private String formatStatus(String status) {
        return switch (status.toUpperCase()) {
            case "APPLIED" -> "Applied — Under initial review";
            case "UNDER_REVIEW" -> "Under Review — Being evaluated";
            case "SHORTLISTED" -> "Shortlisted — Congratulations!";
            case "REJECTED" -> "Not Selected — Thank you for applying";
            case "SELECTED" -> "Selected — Congratulations! You've been chosen!";
            default -> status;
        };
    }
}