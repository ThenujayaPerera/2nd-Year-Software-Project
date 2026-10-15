package com.example.back_end.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_products_category", columnList = "category"),
    @Index(name = "idx_products_is_weekly_highlight", columnList = "is_weekly_highlight"),
    @Index(name = "idx_products_brand", columnList = "brand")
})
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

    @Column(name = "is_weekly_highlight")
    private Boolean isWeeklyHighlight = false;

    private Integer stock = 10;

    private String warranty = "1 Year";

    private String returnPeriod = "30 Days";

    @Column(name = "delivery_fee")
    private Double deliveryFee = 0.0;

    @Column(name = "is_free_delivery")
    private Boolean isFreeDelivery = false;

    @Column(name = "vat_rate")
    private Double vatRate = 0.0;

    @Column(length = 5000)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_description_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", length = 1000)
    @org.hibernate.annotations.BatchSize(size = 50)
    private List<String> descriptionImages = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_gallery_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "gallery_image_url", length = 1000)
    @org.hibernate.annotations.BatchSize(size = 50)
    private List<String> galleryImages = new ArrayList<>();
}
