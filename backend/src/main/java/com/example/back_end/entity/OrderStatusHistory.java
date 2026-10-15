package com.example.back_end.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_status_history", indexes = {
    @Index(name = "idx_order_status_history_order_id", columnList = "order_id"),
    @Index(name = "idx_order_status_history_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Order order;

    @Column(name = "order_number", nullable = false)
    private String orderNumber;

    @Column(name = "status", nullable = false)
    private String status; // PENDING, PLACED, PROCESSING, SHIPPED, DELIVERED, CANCELLED

    @Column(name = "notes")
    private String notes;

    @Column(name = "updated_by")
    private String updatedBy; // CUSTOMER, ADMIN

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public OrderStatusHistory(Order order, String orderNumber, String status, String notes, String updatedBy) {
        this.order = order;
        this.orderNumber = orderNumber;
        this.status = status;
        this.notes = notes;
        this.updatedBy = updatedBy;
    }
}
