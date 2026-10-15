package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "shop_knowledge")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopKnowledge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String category; // e.g. STORE_OVERVIEW, WARRANTY_POLICY, RETURN_REFUND, SHIPPING_DELIVERY, PAYMENTS, SHOWROOM_VR, NV_ELITE_CLUB

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Transient
    private Double similarityScore;

    @Transient
    private Boolean hasVectorEmbedding;
}
