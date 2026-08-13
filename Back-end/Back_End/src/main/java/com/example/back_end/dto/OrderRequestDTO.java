package com.example.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {
    private String userEmail;
    private String customerName;
    private String customerPhone;
    private String shippingAddress;
    private String city;
    private String postalCode;
    private String paymentMethod; // CARD, PAYHERE, STRIPE, BANK, KOKO, COD
    private String paymentStatus; // SUCCESS, PENDING
    private String transactionReference;
    private Double subtotal;
    private Double tax;
    private Double shippingCost;
    private Double totalAmount;
    private List<OrderItemDTO> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDTO {
        private Long productId;
        private String productName;
        private String productImage;
        private Double price;
        private Integer quantity;
        private Double subtotal;
    }
}
