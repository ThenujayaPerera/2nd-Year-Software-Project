package com.example.back_end.controller;

import com.example.back_end.dto.WishlistRequestDTO;
import com.example.back_end.entity.WishlistItem;
import com.example.back_end.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItem>> getWishlist(@RequestParam String userEmail) {
        log.info("Fetching wishlist for email: {}", userEmail);
        return ResponseEntity.ok(wishlistService.getUserWishlist(userEmail));
    }

    @PostMapping
    public ResponseEntity<WishlistItem> addToWishlist(@RequestBody WishlistRequestDTO request) {
        log.info("Adding item to wishlist: {}", request);
        WishlistItem created = wishlistService.addToWishlist(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long productId,
            @RequestParam String userEmail) {
        log.info("Removing product {} from wishlist for email: {}", productId, userEmail);
        wishlistService.removeFromWishlist(userEmail, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearWishlist(@RequestParam String userEmail) {
        log.info("Clearing wishlist for email: {}", userEmail);
        wishlistService.clearWishlist(userEmail);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sync")
    public ResponseEntity<List<WishlistItem>> syncWishlist(
            @RequestParam String userEmail,
            @RequestBody List<WishlistRequestDTO> items) {
        log.info("Syncing {} wishlist items for email: {}", items != null ? items.size() : 0, userEmail);
        List<WishlistItem> synced = wishlistService.syncWishlist(userEmail, items);
        return ResponseEntity.ok(synced);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(
            @RequestParam String userEmail,
            @RequestParam Long productId) {
        boolean exists = wishlistService.isWishlisted(userEmail, productId);
        return ResponseEntity.ok(Map.of("inWishlist", exists));
    }
}
