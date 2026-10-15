package com.example.back_end.service;

import com.example.back_end.dto.ReviewRequestDTO;
import com.example.back_end.entity.Order;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.Review;
import com.example.back_end.exception.ResourceNotFoundException;
import com.example.back_end.repository.OrderRepository;
import com.example.back_end.repository.ProductRepository;
import com.example.back_end.repository.ReviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Submit a customer review after product delivery
     */
    @Transactional
    public Review submitReview(ReviewRequestDTO dto) {
        log.info("Submitting review for product ID {} from user {}", dto.getProductId(), dto.getUserEmail());

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + dto.getProductId()));

        Order order = orderRepository.findByOrderNumber(dto.getOrderNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with order number: " + dto.getOrderNumber()));

        // Check that the order is actually DELIVERED
        if (!"DELIVERED".equalsIgnoreCase(order.getStatus())) {
            log.warn("Attempt to review before delivery. Order status is: {}", order.getStatus());
            throw new IllegalArgumentException("Reviews and ratings can only be submitted after your order has been delivered.");
        }

        // Verify the product is part of this order
        boolean productInOrder = order.getItems() != null && order.getItems().stream()
                .anyMatch(item -> dto.getProductId().equals(item.getProductId()));
        if (!productInOrder) {
            throw new IllegalArgumentException("This product is not part of the specified order.");
        }

        // Verify user email matches the order
        if (!order.getUserEmail().equalsIgnoreCase(dto.getUserEmail())) {
            throw new IllegalArgumentException("The user email does not match the order billing details.");
        }

        // Prevent duplicate reviews for the same delivered order item
        if (reviewRepository.existsByOrderNumberAndProductId(dto.getOrderNumber(), dto.getProductId())) {
            throw new IllegalArgumentException("You have already submitted a review for this delivered product in order " + dto.getOrderNumber());
        }

        Review review = new Review();
        review.setProductId(product.getId());
        review.setProductName(product.getName());
        review.setProductImage(product.getImage());
        review.setOrderNumber(order.getOrderNumber());
        review.setUserEmail(dto.getUserEmail());
        review.setUserName(dto.getUserName() != null && !dto.getUserName().trim().isEmpty() ? dto.getUserName().trim() : order.getCustomerName());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment().trim());
        review.setStatus("PENDING"); // Requires admin approval before appearing on site

        Review savedReview = reviewRepository.save(review);
        log.info("Review created successfully with ID: {} in PENDING state", savedReview.getId());
        return savedReview;
    }

    /**
     * Get approved reviews for a specific product
     */
    public List<Review> getApprovedReviewsForProduct(Long productId) {
        return reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, "APPROVED");
    }

    /**
     * Get approved testimonials/reviews for the About page & Website highlights
     */
    public List<Review> getApprovedFeaturedReviews() {
        return reviewRepository.findByStatusOrderByCreatedAtDesc("APPROVED");
    }

    /**
     * Get user reviews
     */
    public List<Review> getUserReviews(String email) {
        return reviewRepository.findByUserEmailOrderByCreatedAtDesc(email);
    }

    /**
     * Admin: Fetch all reviews
     */
    public List<Review> getAllReviewsForAdmin() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Admin: Approve or Reject a review
     */
    @Transactional
    public Review updateReviewStatus(Long reviewId, String status, String adminNotes) {
        log.info("Updating review ID {} status to {}", reviewId, status);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));

        review.setStatus(status.toUpperCase());
        if (adminNotes != null) {
            review.setAdminNotes(adminNotes);
        }
        Review updated = reviewRepository.save(review);

        // Recalculate product rating & count based on approved reviews
        recalculateProductRating(review.getProductId());

        return updated;
    }

    /**
     * Admin: Delete review
     */
    @Transactional
    public void deleteReview(Long reviewId) {
        log.info("Deleting review ID {}", reviewId);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));
        Long productId = review.getProductId();
        reviewRepository.delete(review);
        recalculateProductRating(productId);
    }

    private void recalculateProductRating(Long productId) {
        Double avg = reviewRepository.getAverageRatingForProduct(productId);
        Long count = reviewRepository.countByProductIdAndStatus(productId, "APPROVED");

        productRepository.findById(productId).ifPresent(p -> {
            if (count != null && count > 0 && avg != null) {
                p.setRating(Math.round(avg * 10.0) / 10.0);
                p.setReviews(count.intValue());
            }
            productRepository.save(p);
            log.info("Updated product ID {} rating to {} based on {} approved reviews", productId, p.getRating(), p.getReviews());
        });
    }
}
