package com.example.back_end.config;

import com.example.back_end.entity.Product;
import com.example.back_end.entity.User;
import com.example.back_end.repository.ProductRepository;
import com.example.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding initial users into database...");
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setIsActive(true);

            User user = new User();
            user.setName("John Doe");
            user.setEmail("john@example.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setIsActive(true);

            userRepository.saveAll(List.of(admin, user));
            log.info("Users seeded successfully.");
        }

        // Re-seed or update products to match official 11 nvshop.lk categories
        log.info("Updating product database to official 11 NVSHOP.LK categories...");
        productRepository.deleteAll();

        List<Product> products = new ArrayList<>();

        // 1. Apple iPhone
        products.add(createProduct("Apple Original 20W USB-C Power Adapter", 6500.0, 7500.0, "Apple iPhone", "Apple", 4.9, 210, "https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600", 13, true, 20, "1 Year", "7 Days", "Genuine Apple 20W fast charging wall adapter for iPhone 12, 13, 14, 15 series."));
        products.add(createProduct("Apple MagSafe Clear Case for iPhone 15 Pro", 14500.0, 16900.0, "Apple iPhone", "Apple", 4.8, 85, "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600", 14, true, 15, "1 Year", "7 Days", "Thin, light, and easy to grip case showing off the brilliant finish of iPhone 15 Pro."));

        // 2. Earphones & Headsets
        products.add(createProduct("Anker Soundcore Life Q30 ANC Headphones", 24500.0, 28900.0, "Earphones & Headsets", "Anker", 4.9, 310, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", 15, true, 18, "18 Months", "7 Days", "Advanced hybrid active noise cancellation with Hi-Res Audio and 40-hour playtime."));
        products.add(createProduct("Aspor A616 TWS Wireless Earphones", 4900.0, 6500.0, "Earphones & Headsets", "Aspor", 4.7, 53, "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600", 24, true, 25, "6 Months", "7 Days", "Bluetooth 5.3 TWS earphones with touch controls and deep bass sound."));

        // 3. Power Banks
        products.add(createProduct("Anker 737 Power Bank 24,000mAh 140W", 42000.0, 48000.0, "Power Banks", "Anker", 4.9, 145, "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600", 12, true, 10, "18 Months", "7 Days", "Ultra-powerful 140W output power bank with smart digital display for laptops & phones."));
        products.add(createProduct("Baseus Adaman 20000mAh 22.5W Fast Power Bank", 11200.0, 14500.0, "Power Banks", "Baseus", 4.8, 190, "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600", 22, false, 30, "12 Months", "7 Days", "Metallic finish 20000mAh power bank supporting QC 3.0 & PD 3.0 fast charging."));

        // 4. Speakers
        products.add(createProduct("Anker Soundcore Motion+ 30W Hi-Res Speaker", 29800.0, 34500.0, "Speakers", "Anker", 4.9, 220, "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600", 13, true, 12, "18 Months", "7 Days", "Ultra-wide frequency range Hi-Res bluetooth speaker with BassUp technology."));

        // 5. Chargers & Cables & Adapters
        products.add(createProduct("UGREEN Nexode 65W GaN 3-Port Fast Charger", 9800.0, 12500.0, "Chargers & Cables & Adapters", "UGREEN", 4.9, 142, "https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600", 21, true, 22, "12 Months", "7 Days", "Compact 65W GaN charger with 2 USB-C and 1 USB-A ports for laptops & phones."));
        products.add(createProduct("Anker PowerLine III USB-C to USB-C Cable 100W", 3400.0, 4200.0, "Chargers & Cables & Adapters", "Anker", 4.8, 96, "https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600", 19, false, 40, "18 Months", "7 Days", "Durable nylon braided 100W fast charging cable supporting PD fast charging."));

        // 6. Phone Cases & Back Covers
        products.add(createProduct("Spigen Ultra Hybrid Case for iPhone 15 Pro", 6800.0, 8200.0, "Phone Cases & Back Covers", "Spigen", 4.9, 175, "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600", 17, true, 35, "12 Months", "7 Days", "Clear shock-absorption bumper case with Air Cushion Technology for iPhone 15 Pro."));

        // 7. Screen Protectors
        products.add(createProduct("Spigen EZ Fit Tempered Glass Guard (2-Pack)", 4500.0, 5500.0, "Screen Protectors", "Spigen", 4.9, 240, "https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600", 18, true, 50, "12 Months", "7 Days", "Auto-alignment tray kit for bubble-free 9H hardness tempered glass installation."));

        // 8. Smart Watches
        products.add(createProduct("Apple Watch Series 9 GPS 45mm Midnight", 128000.0, 145000.0, "Smart Watches", "Apple", 4.9, 65, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600", 11, true, 8, "1 Year", "7 Days", "Advanced health sensors, Double Tap gesture control, and bright Always-On Retina display."));

        // 9. Mouse & Keyboards
        products.add(createProduct("Logitech MX Master 3S Performance Wireless Mouse", 34500.0, 39900.0, "Mouse & Keyboards", "Logitech", 4.9, 130, "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500", 13, true, 14, "2 Years", "7 Days", "Quiet clicks, 8K DPI sensor for glass tracking, and MagSpeed electromagnetic scroll wheel."));

        // 10. Pendrives & SD Cards
        products.add(createProduct("SanDisk Extreme Pro 128GB MicroSDXC 200MB/s", 7800.0, 9500.0, "Pendrives & SD Cards", "SanDisk", 4.9, 320, "https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600", 17, false, 45, "Lifetime", "7 Days", "High-speed A2 4K UHD MicroSD memory card for action cameras, drones & phones."));

        // 11. Others
        products.add(createProduct("UGREEN Aluminum Foldable Desk Phone Stand", 2900.0, 3800.0, "Others", "UGREEN", 4.8, 110, "https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600", 23, true, 30, "12 Months", "7 Days", "Adjustable multi-angle aluminum desktop stand for smartphones and tablets."));

        productRepository.saveAll(products);
        log.info("Successfully seeded {} products across all 11 official NVSHOP.LK categories.", products.size());
    }

    private Product createProduct(String name, Double price, Double originalPrice, String category, String brand, Double rating, Integer reviews, String image, Integer discount, Boolean isNew, Integer stock, String warranty, String returnPeriod, String description) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setOriginalPrice(originalPrice);
        p.setCategory(category);
        p.setBrand(brand);
        p.setRating(rating);
        p.setReviews(reviews);
        p.setImage(image);
        p.setDiscount(discount);
        p.setIsNew(isNew);
        p.setStock(stock);
        p.setWarranty(warranty);
        p.setReturnPeriod(returnPeriod);
        p.setDescription(description);
        return p;
    }
}
