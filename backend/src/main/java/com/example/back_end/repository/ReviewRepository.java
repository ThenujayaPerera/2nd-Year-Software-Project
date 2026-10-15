package com.example.back_end.repository;

import com.example.back_end.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductIdAndStatusOrderByCreatedAtDesc(Long productId, String status);

    List<Review> findByStatusOrderByCreatedAtDesc(String status);

    List<Review> findAllByOrderByCreatedAtDesc();

    List<Review> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    boolean existsByOrderNumberAndProductId(String orderNumber, Long productId);

    Long countByProductIdAndStatus(Long productId, String status);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId AND r.status = 'APPROVED'")
    Double getAverageRatingForProduct(@Param("productId") Long productId);
}
