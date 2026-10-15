package com.example.back_end.controller;

import com.example.back_end.entity.Product;
import com.example.back_end.service.ProductService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Get all products
     * GET /api/products
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q) {
        if (q != null && !q.trim().isEmpty()) {
            log.info("Searching products with query: {}", q);
            return ResponseEntity.ok(productService.searchProducts(q));
        }
        if (category != null && !category.trim().isEmpty()) {
            log.info("Fetching products for category: {}", category);
            return ResponseEntity.ok(productService.getProductsByCategory(category));
        }
        log.info("Fetching all products");
        return ResponseEntity.ok(productService.getAllProducts());
    }

    /**
     * Get weekly highlights
     * GET /api/products/highlights
     */
    @GetMapping("/highlights")
    public ResponseEntity<List<Product>> getWeeklyHighlights() {
        log.info("Fetching weekly highlighted products");
        return ResponseEntity.ok(productService.getWeeklyHighlights());
    }

    /**
     * Get product by ID
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        log.info("Fetching product with ID: {}", id);
        return ResponseEntity.ok(productService.getProductById(id));
    }

    /**
     * Create product
     * POST /api/products
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        log.info("Creating product: {}", product.getName());
        Product created = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update product
     * PUT /api/products/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        log.info("Updating product ID: {}", id);
        Product updated = productService.updateProduct(id, product);
        return ResponseEntity.ok(updated);
    }

    /**
     * Toggle product weekly highlight
     * PUT /api/products/{id}/highlight
     */
    @PutMapping("/{id}/highlight")
    public ResponseEntity<Product> toggleHighlight(@PathVariable Long id) {
        log.info("Toggling highlight for product ID: {}", id);
        return ResponseEntity.ok(productService.toggleWeeklyHighlight(id));
    }

    /**
     * Delete product
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        log.info("Deleting product ID: {}", id);
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * AI Product Comparison Endpoint
     * POST /api/products/ai-compare
     */
    @PostMapping("/ai-compare")
    public ResponseEntity<java.util.Map<String, Object>> compareProductsWithAi(@RequestBody java.util.Map<String, Object> payload) {
        java.util.List<Long> ids = new java.util.ArrayList<>();
        if (payload != null) {
            if (payload.get("productIds") instanceof java.util.List) {
                java.util.List<?> list = (java.util.List<?>) payload.get("productIds");
                for (Object o : list) {
                    if (o instanceof Number) {
                        ids.add(((Number) o).longValue());
                    }
                }
            } else {
                if (payload.get("productId1") instanceof Number) ids.add(((Number) payload.get("productId1")).longValue());
                if (payload.get("productId2") instanceof Number) ids.add(((Number) payload.get("productId2")).longValue());
                if (payload.get("productId3") instanceof Number) ids.add(((Number) payload.get("productId3")).longValue());
            }
        }
        log.info("Generating AI comparison for {} product(s): {}", ids.size(), ids);
        return ResponseEntity.ok(productService.compareProductsWithAi(ids));
    }
}
