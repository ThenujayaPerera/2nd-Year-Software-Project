package com.example.back_end.service;

import com.example.back_end.dto.WishlistRequestDTO;
import com.example.back_end.entity.WishlistItem;
import com.example.back_end.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;

    @Transactional(readOnly = true)
    public List<WishlistItem> getUserWishlist(String userEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return List.of();
        }
        return wishlistItemRepository.findByUserEmailOrderByAddedAtDesc(userEmail.trim());
    }

    @Transactional
    public WishlistItem addToWishlist(WishlistRequestDTO request) {
        if (request.getUserEmail() == null || request.getProductId() == null) {
            throw new IllegalArgumentException("User email and product ID are required");
        }

        String email = request.getUserEmail().trim();
        Optional<WishlistItem> existing = wishlistItemRepository.findByUserEmailAndProductId(email, request.getProductId());
        if (existing.isPresent()) {
            return existing.get();
        }

        WishlistItem item = new WishlistItem();
        item.setUserEmail(email);
        item.setProductId(request.getProductId());
        item.setProductName(request.getProductName() != null ? request.getProductName() : "Product #" + request.getProductId());
        item.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);
        item.setOriginalPrice(request.getOriginalPrice());
        item.setCategory(request.getCategory() != null ? request.getCategory() : "Accessories");
        item.setBrand(request.getBrand() != null ? request.getBrand() : "Generic");
        item.setImage(request.getImage());
        item.setRating(request.getRating() != null ? request.getRating() : 4.5);
        item.setStock(request.getStock() != null ? request.getStock() : 10);
        item.setAddedAt(LocalDateTime.now());

        log.info("Adding product {} to wishlist for user {}", request.getProductId(), email);
        return wishlistItemRepository.save(item);
    }

    @Transactional
    public void removeFromWishlist(String userEmail, Long productId) {
        if (userEmail != null && productId != null) {
            log.info("Removing product {} from wishlist for user {}", productId, userEmail);
            wishlistItemRepository.deleteByUserEmailAndProductId(userEmail.trim(), productId);
        }
    }

    @Transactional
    public void clearWishlist(String userEmail) {
        if (userEmail != null && !userEmail.trim().isEmpty()) {
            log.info("Clearing wishlist for user {}", userEmail);
            wishlistItemRepository.deleteByUserEmail(userEmail.trim());
        }
    }

    @Transactional
    public List<WishlistItem> syncWishlist(String userEmail, List<WishlistRequestDTO> items) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return List.of();
        }

        String email = userEmail.trim();
        if (items != null) {
            for (WishlistRequestDTO req : items) {
                if (req.getProductId() != null) {
                    req.setUserEmail(email);
                    Optional<WishlistItem> existing = wishlistItemRepository.findByUserEmailAndProductId(email, req.getProductId());
                    if (existing.isEmpty()) {
                        addToWishlist(req);
                    }
                }
            }
        }

        return wishlistItemRepository.findByUserEmailOrderByAddedAtDesc(email);
    }

    @Transactional(readOnly = true)
    public boolean isWishlisted(String userEmail, Long productId) {
        if (userEmail == null || productId == null) {
            return false;
        }
        return wishlistItemRepository.findByUserEmailAndProductId(userEmail.trim(), productId).isPresent();
    }
}
