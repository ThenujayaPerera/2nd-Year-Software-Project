package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String company;
    private String email;
    private String phone;
    
    @Column(columnDefinition = "TEXT")
    private String suppliedItems;
}
