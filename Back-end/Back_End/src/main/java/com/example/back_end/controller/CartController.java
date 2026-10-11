package com.example.back_end.controller;

import com.example.back_end.entity.Cart;
import com.example.back_end.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {

    private final CartService cartService;

    // Get the user's cart (GET /api/cart?email=...)
    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestParam String email) {
        log.info("Fetching cart for user: {}", email);
        return ResponseEntity.ok(cartService.getCartByUserEmail(email));
    }

    // Add an item (POST /api/cart/add?email=...)
    @PostMapping("/add")
    public ResponseEntity<Cart> addItem(@RequestParam String email, @RequestBody AddItemRequest request) {
        log.info("Adding item to cart for user: {}", email);
        return ResponseEntity.ok(cartService.addItemToCart(email, request.getProductId(), request.getQuantity()));
    }

    // Remove an item (DELETE /api/cart/remove/{productId}?email=...)
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeItem(@RequestParam String email, @PathVariable Long productId) {
        log.info("Removing product {} from cart for user: {}", productId, email);
        return ResponseEntity.ok(cartService.removeItemFromCart(email, productId));
    }

    // Clear the cart (DELETE /api/cart/clear?email=...)
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam String email) {
        log.info("Clearing cart for user: {}", email);
        cartService.clearCart(email);
        return ResponseEntity.ok().build();
    }

    // Simple inner DTO for the POST request body
    public static class AddItemRequest {
        private Long productId;
        private int quantity;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}
