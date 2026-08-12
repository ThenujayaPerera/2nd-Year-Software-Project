package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_reference", unique = true, nullable = false)
    private String transactionReference;

    @Column(name = "order_number", nullable = false)
    private String orderNumber;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String currency; // LKR, USD

    @Column(name = "payment_gateway", nullable = false)
    private String paymentGateway; // PAYHERE, STRIPE, BANK_TRANSFER, COD

    @Column(nullable = false)
    private String status; // SUCCESS, PENDING, FAILED

    @Column(name = "card_last4")
    private String cardLast4;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
