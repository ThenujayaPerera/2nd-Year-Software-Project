package com.example.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistRequestDTO {
    private String userEmail;
    private Long productId;
    private String productName;
    private Double price;
    private Double originalPrice;
    private String category;
    private String brand;
    private String image;
    private Double rating;
    private Integer stock;
}
