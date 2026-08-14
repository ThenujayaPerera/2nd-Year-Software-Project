package com.example.back_end.service;

import com.example.back_end.entity.Cart;
import com.example.back_end.entity.CartItem;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.User;
import com.example.back_end.repository.CartRepository;
import com.example.back_end.repository.ProductRepository;
import com.example.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // Fetch a user's cart (creates an empty one if it doesn't exist yet)
    @Transactional
    public Cart getCartByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setItems(new ArrayList<>());
            return cartRepository.save(newCart);
        });
    }

    // Add an item to the cart
    @Transactional
    public Cart addItemToCart(String email, Long productId, int quantity) {
        Cart cart = getCartByUserEmail(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if item already exists in the cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    // Remove an item from the cart
    @Transactional
    public Cart removeItemFromCart(String email, Long productId) {
        Cart cart = getCartByUserEmail(email);
        
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        // Note: For automatic deletion of the orphaned CartItem from the database, 
        // ensure your Cart entity has @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
        
        return cartRepository.save(cart);
    }
    
    // Clear the entire cart
    @Transactional
    public void clearCart(String email) {
        Cart cart = getCartByUserEmail(email);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
