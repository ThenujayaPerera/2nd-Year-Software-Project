package com.example.back_end.service;

import com.example.back_end.entity.Product;
import com.example.back_end.exception.ResourceNotFoundException;
import com.example.back_end.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @PostConstruct
    public void seedInitialProducts() {
        if (productRepository.count() == 0) {
            log.info("Seeding initial tech accessory products...");
            List<Product> seedProducts = new ArrayList<>();

            String[] categories = {"Cases", "Chargers", "Cables", "Protection", "Wireless"};
            String[] brands = {"Apple", "Samsung", "Anker", "Spigen", "NV-Premium", "PowerFlow", "ArmorShield", "NV-Tech"};
            String[] images = {
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600&auto=format&fit=crop"
            };

            for (int i = 0; i < 24; i++) {
                String category = categories[i % categories.length];
                String brand = brands[i % brands.length];
                double price = (i % 10 + 2) * 1200.0;
                Double origPrice = (i % 2 == 0) ? price * 1.25 : null;

                Product p = new Product();
                p.setName(brand + " " + (category.equals("Protection") ? "Tempered Glass Guard" : category.substring(0, category.length() - 1)) + " Pro");
                p.setPrice(price);
                p.setOriginalPrice(origPrice);
                p.setCategory(category);
                p.setBrand(brand);
                p.setRating(4.0 + (i % 10) * 0.1);
                p.setReviews(12 + i * 5);
                p.setImage(images[i % images.length]);
                p.setDiscount(origPrice != null ? 20 : 0);
                p.setIsNew(i % 3 == 0);
                p.setStock(5 + i);
                p.setWarranty("2 Years");
                p.setReturnPeriod("30 Days");
                p.setDescription("High precision " + category.toLowerCase() + " engineered for maximum performance, protection, and endurance.");

                seedProducts.add(p);
            }

            productRepository.saveAll(seedProducts);
            log.info("Successfully seeded {} products.", seedProducts.size());
        }
    }

    @org.springframework.cache.annotation.Cacheable(value = "products", key = "'all'")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @org.springframework.cache.annotation.Cacheable(value = "products", key = "#id")
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
    }

    @org.springframework.cache.annotation.Cacheable(value = "products", key = "'cat_' + #category")
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.searchProducts(query);
    }

    @org.springframework.cache.annotation.CacheEvict(value = "products", allEntries = true)
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @org.springframework.cache.annotation.CacheEvict(value = "products", allEntries = true)
    public Product updateProduct(Long id, Product productDetails) {
        Product existing = getProductById(id);
        existing.setName(productDetails.getName());
        existing.setPrice(productDetails.getPrice());
        existing.setOriginalPrice(productDetails.getOriginalPrice());
        existing.setCategory(productDetails.getCategory());
        existing.setBrand(productDetails.getBrand());
        existing.setStock(productDetails.getStock());
        existing.setDescription(productDetails.getDescription());
        if (productDetails.getWarranty() != null) {
            existing.setWarranty(productDetails.getWarranty());
        }
        if (productDetails.getImage() != null) {
            existing.setImage(productDetails.getImage());
        }
        if (productDetails.getDiscount() != null) {
            existing.setDiscount(productDetails.getDiscount());
        }
        if (productDetails.getRating() != null) {
            existing.setRating(productDetails.getRating());
        }
        if (productDetails.getReviews() != null) {
            existing.setReviews(productDetails.getReviews());
        }
        if (productDetails.getIsNew() != null) {
            existing.setIsNew(productDetails.getIsNew());
        }
        if (productDetails.getReturnPeriod() != null) {
            existing.setReturnPeriod(productDetails.getReturnPeriod());
        }
        if (productDetails.getDeliveryFee() != null) {
            existing.setDeliveryFee(productDetails.getDeliveryFee());
        }
        if (productDetails.getIsFreeDelivery() != null) {
            existing.setIsFreeDelivery(productDetails.getIsFreeDelivery());
        }
        if (productDetails.getVatRate() != null) {
            existing.setVatRate(productDetails.getVatRate());
        }
        return productRepository.save(existing);
    }

    @org.springframework.cache.annotation.CacheEvict(value = "products", allEntries = true)
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    @org.springframework.cache.annotation.Cacheable(value = "products", key = "'highlights'")
    public List<Product> getWeeklyHighlights() {
        return productRepository.findByIsWeeklyHighlightTrue();
    }

    @org.springframework.cache.annotation.CacheEvict(value = "products", allEntries = true)
    public Product toggleWeeklyHighlight(Long id) {
        Product product = getProductById(id);
        product.setIsWeeklyHighlight(!product.getIsWeeklyHighlight());
        return productRepository.save(product);
    }

    @Autowired
    private RagService ragService;

    public java.util.Map<String, Object> compareProductsWithAi(List<Long> ids) {
        List<Product> products = new java.util.ArrayList<>();
        if (ids != null) {
            for (Long id : ids) {
                if (id != null) {
                    try {
                        products.add(getProductById(id));
                    } catch (Exception e) {
                        // ignore invalid id
                    }
                }
            }
        }
        return ragService.compareProducts(products);
    }

    public java.util.Map<String, Object> compareProductsWithAi(Long id1, Long id2) {
        return compareProductsWithAi(java.util.List.of(id1, id2));
    }
}
