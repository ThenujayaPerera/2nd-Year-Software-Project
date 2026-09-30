package com.example.back_end.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name cannot be blank")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Price is required")
    @Column(nullable = false)
    private Double price;

    private Double originalPrice;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Brand is required")
    private String brand;

    private Double rating = 4.5;

    private Integer reviews = 15;

    @Column(length = 1000)
    private String image;

    private Integer discount = 0;

    private Boolean isNew = false;

    private Integer stock = 10;

    private String warranty = "1 Year";

    private String returnPeriod = "30 Days";

    @Column(length = 2000)
    private String description;
}
