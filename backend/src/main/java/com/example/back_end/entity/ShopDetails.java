package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "shop_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shop_name", nullable = false)
    private String shopName;

    @Column(name = "tagline")
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "email")
    private String email;

    @Column(name = "support_email")
    private String supportEmail;

    @Column(name = "hotline")
    private String hotline;

    @Column(name = "phone_secondary")
    private String phoneSecondary;

    @Column(name = "whatsapp")
    private String whatsapp;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String city;
    private String postalCode;

    @Column(name = "google_maps_url", length = 1000)
    private String googleMapsUrl;

    @Column(name = "business_hours", columnDefinition = "TEXT")
    private String businessHours;

    @Column(name = "warranty_policy", columnDefinition = "TEXT")
    private String warrantyPolicy;

    @Column(name = "return_policy", columnDefinition = "TEXT")
    private String returnPolicy;

    @Column(name = "shipping_policy", columnDefinition = "TEXT")
    private String shippingPolicy;

    @Column(name = "payment_methods", columnDefinition = "TEXT")
    private String paymentMethods;

    @Column(name = "showroom_info", columnDefinition = "TEXT")
    private String showroomInfo;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
