package com.example.back_end.repository;

import com.example.back_end.entity.ShopDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopDetailsRepository extends JpaRepository<ShopDetails, Long> {
    Optional<ShopDetails> findFirstByOrderByIdAsc();
}
