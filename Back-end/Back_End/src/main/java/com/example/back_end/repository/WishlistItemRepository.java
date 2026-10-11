package com.example.back_end.repository;

import com.example.back_end.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserEmailOrderByAddedAtDesc(String userEmail);
    Optional<WishlistItem> findByUserEmailAndProductId(String userEmail, Long productId);
    void deleteByUserEmailAndProductId(String userEmail, Long productId);
    void deleteByUserEmail(String userEmail);
    long countByUserEmail(String userEmail);
}
