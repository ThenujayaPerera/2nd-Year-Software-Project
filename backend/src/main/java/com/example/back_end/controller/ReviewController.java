package com.example.back_end.controller;

import com.example.back_end.dto.ReviewRequestDTO;
import com.example.back_end.entity.Review;
import com.example.back_end.service.ReviewService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    /**
     * Submit a product rating & comment after order delivery
     * POST /api/reviews
     */
    @PostMapping("/reviews")
    public ResponseEntity<?> submitReview(@Valid @RequestBody ReviewRequestDTO request) {
        log.info("Received review submission for product ID: {}", request.getProductId());
        try {
            Review review = reviewService.submitReview(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Your review and rating have been submitted successfully. It will become visible once approved by store moderation.",
                    "review", review
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get approved reviews for a specific product
     * GET /api/reviews/product/{productId}
     */
    @GetMapping("/reviews/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getApprovedReviewsForProduct(productId));
    }

    /**
     * Get approved reviews for the website (About page / Home page testimonials)
     * GET /api/reviews/featured
     */
    @GetMapping("/reviews/featured")
    public ResponseEntity<List<Review>> getFeaturedReviews() {
        return ResponseEntity.ok(reviewService.getApprovedFeaturedReviews());
    }

    /**
     * Get reviews submitted by a user
     * GET /api/reviews/user?email=...
     */
    @GetMapping("/reviews/user")
    public ResponseEntity<List<Review>> getUserReviews(@RequestParam String email) {
        return ResponseEntity.ok(reviewService.getUserReviews(email));
    }

    /**
     * Admin: Fetch all customer reviews for moderation
     * GET /api/admin/reviews
     */
    @GetMapping("/admin/reviews")
    public ResponseEntity<List<Review>> getAllReviewsForAdmin() {
        return ResponseEntity.ok(reviewService.getAllReviewsForAdmin());
    }

    /**
     * Admin: Moderate review status (APPROVED or REJECTED)
     * PUT /api/admin/reviews/{id}/status
     */
    @PutMapping("/admin/reviews/{id}/status")
    public ResponseEntity<?> updateReviewStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String notes = payload.get("notes");
        if (status == null || (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("REJECTED") && !status.equalsIgnoreCase("PENDING"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status must be APPROVED, REJECTED, or PENDING"));
        }
        Review updated = reviewService.updateReviewStatus(id, status, notes);
        return ResponseEntity.ok(Map.of(
                "message", "Review status updated to " + status,
                "review", updated
        ));
    }

    /**
     * Admin: Delete a review
     * DELETE /api/admin/reviews/{id}
     */
    @DeleteMapping("/admin/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }
}
