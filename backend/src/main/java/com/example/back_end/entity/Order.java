package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_orders_user_email", columnList = "user_email"),
    @Index(name = "idx_orders_created_at", columnList = "created_at"),
    @Index(name = "idx_orders_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;

    @Column(name = "shipping_address", nullable = false)
    private String shippingAddress;

    private String city;
    private String postalCode;

    private Double subtotal;
    private Double tax;
    private Double shippingCost;
    private Double totalAmount;

    @Column(name = "status", nullable = false)
    private String status; // PENDING, PLACED, PROCESSING, SHIPPED, DELIVERED, CANCELLED

    @Column(name = "payment_method")
    private String paymentMethod; // CARD, PAYHERE, STRIPE, BANK, KOKO, COD

    @Column(name = "payment_status")
    private String paymentStatus; // SUCCESS, PENDING, FAILED

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @org.hibernate.annotations.BatchSize(size = 50)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @org.hibernate.annotations.BatchSize(size = 50)
    @OrderBy("createdAt ASC")
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Set<OrderStatusHistory> statusHistory = new LinkedHashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
