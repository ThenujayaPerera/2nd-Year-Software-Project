package com.example.back_end.config;

import com.example.back_end.entity.Order;
import com.example.back_end.entity.OrderItem;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.User;
import com.example.back_end.repository.OrderRepository;
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
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUserIfMissing("admin@example.com", "Admin User", "+94 76 989 0079", "admin123", "185/1/2B New Road, Ambalangoda, Sri Lanka");
        seedUserIfMissing("john@example.com", "John Doe", "+94 71 123 4567", "user123", "Colombo, Sri Lanka");
        seedUserIfMissing("hibosa972@gmail.com", "Hibosa Customer", "+94 76 989 0079", "12345678", "185/1/2B New Road, Ambalangoda, Sri Lanka");
        seedUserIfMissing("khimasha16@gmail.com", "Kulashi Himasha", "+94 76 227 7566", "12345678", "185/1/2B New Road, Ambalangoda, Sri Lanka");
        seedUserIfMissing("mayanthanawarathna37@gmail.com", "Mayantha Nawarathna", "+94 72 583 5742", "12345678", "185/1/2B New Road, Ambalangoda, Sri Lanka");

        // Clean & Sync exact live products with 100% reliable high-res tech gadget images
        log.info("Syncing high-definition product catalog into database...");
        productRepository.deleteAll();

        List<Product> products = new ArrayList<>();

        // --- 1. Apple iPhone ---
        products.add(createProduct(
                "Apple iPhone 17 Pro Max 256GB (X/A)",
                445000.0, 465000.0,
                "Apple iPhone", "Apple", 5.0, 42,
                "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80",
                4, true, 5, "1 Year Apple Care", "7 Days",
                "Buy genuine Apple iPhone 17 Pro Max 256GB (X/A) with Apple warranty at NVSHOP.LK Sri Lanka."
        ));
        products.add(createProduct(
                "Apple Original 20W USB-C Power Adapter",
                6500.0, 7500.0,
                "Apple iPhone", "Apple", 4.9, 195,
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
                13, true, 20, "1 Year", "7 Days",
                "Genuine Apple 20W fast charging wall adapter for iPhone 11, 12, 13, 14, 15, 16 series."
        ));

        // --- 2. Smart Watches ---
        products.add(createProduct(
                "Green Lion Gravix Smart Watch",
                14500.0, 16500.0,
                "Smart Watches", "Green Lion", 4.8, 64,
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
                12, true, 15, "6 Months Warranty", "7 Days",
                "Buy genuine Green Lion Gravix Smart Watch with AMOLED Display and Bluetooth calling at NVSHOP.LK Sri Lanka."
        ));
        products.add(createProduct(
                "Green Lion Active SE Smart Watch",
                12800.0, 14900.0,
                "Smart Watches", "Green Lion", 4.7, 48,
                "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
                14, true, 18, "6 Months Warranty", "7 Days",
                "Buy genuine Green Lion Active SE Smart Watch with fitness tracking and heart rate monitor."
        ));
        products.add(createProduct(
                "Black Shark S3 Smart Watch",
                16900.0, 19500.0,
                "Smart Watches", "Black Shark", 4.9, 72,
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
                13, true, 12, "6 Months Warranty", "7 Days",
                "Buy genuine Black Shark S3 Smart Watch with ultra-clear display and gaming styling."
        ));
        products.add(createProduct(
                "Green Lion Hilux Smart Watch",
                13900.0, 15900.0,
                "Smart Watches", "Green Lion", 4.7, 39,
                "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&auto=format&fit=crop&q=80",
                12, false, 14, "6 Months Warranty", "7 Days",
                "Buy genuine Green Lion Hilux Smart Watch with long battery life and premium metallic body."
        ));
        products.add(createProduct(
                "Black Shark A3 Smart Watch",
                15500.0, 17900.0,
                "Smart Watches", "Black Shark", 4.8, 51,
                "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&auto=format&fit=crop&q=80",
                13, true, 10, "6 Months Warranty", "7 Days",
                "Buy genuine Black Shark A3 Smart Watch with sports modes and IP68 waterproof rating."
        ));
        products.add(createProduct(
                "Green Lion Ridge Smart Watch",
                14200.0, 16000.0,
                "Smart Watches", "Green Lion", 4.8, 33,
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
                11, false, 12, "6 Months Warranty", "7 Days",
                "Buy genuine Green Lion Ridge Smart Watch with dual-color strap and rugged bezel."
        ));
        products.add(createProduct(
                "WiWU SW05 Smart Watch",
                11500.0, 13500.0,
                "Smart Watches", "WiWU", 4.6, 28,
                "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop&q=80",
                15, true, 16, "6 Months Warranty", "7 Days",
                "Buy genuine WiWU SW05 Smart Watch with sleek lightweight design and HD touchscreen."
        ));
        products.add(createProduct(
                "Haylou RS5 Smart Watch",
                13500.0, 15500.0,
                "Smart Watches", "Haylou", 4.7, 45,
                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
                13, true, 15, "6 Months Warranty", "7 Days",
                "Buy genuine Haylou RS5 Smart Watch with 2.01 inch AMOLED display and aerospace metallic frame."
        ));
        products.add(createProduct(
                "Black Shark GT3 Neo Smart Watch",
                12900.0, 14800.0,
                "Smart Watches", "Black Shark", 4.7, 36,
                "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
                13, false, 20, "6 Months Warranty", "7 Days",
                "Buy genuine Black Shark GT3 Neo with curved display and AI voice assistant."
        ));
        products.add(createProduct(
                "Black Shark Watch S1",
                17500.0, 19900.0,
                "Smart Watches", "Black Shark", 4.9, 89,
                "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&auto=format&fit=crop&q=80",
                12, true, 11, "6 Months Warranty", "7 Days",
                "Buy genuine Black Shark Watch S1 with 1.43 AMOLED display, ENC Bluetooth calling."
        ));

        // --- 3. Power Banks ---
        products.add(createProduct(
                "UGREEN 300W 48000mAh Smart Digital Display Power Bank",
                58000.0, 65000.0,
                "Power Banks", "UGREEN", 5.0, 94,
                "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80",
                11, true, 8, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 300W 48000mAh Smart Digital Display Power Bank with 1 Year Warranty at NVSHOP.LK."
        ));
        products.add(createProduct(
                "UGREEN 20000mAh 30W Fast Charging Power Bank",
                12800.0, 15500.0,
                "Power Banks", "UGREEN", 4.9, 142,
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
                17, true, 25, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 20000mAh 30W Fast Charging Power Bank with 1 Year Warranty at NVSHOP.LK."
        ));
        products.add(createProduct(
                "UGREEN 20000mAh 165W Fast Charging Power Bank",
                28500.0, 33000.0,
                "Power Banks", "UGREEN", 4.9, 87,
                "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
                14, true, 12, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 20000mAh 165W Fast Charging Power Bank with 1 Year Warranty at NVSHOP.LK."
        ));
        products.add(createProduct(
                "UGREEN 20000mAh 45W Fast Charging Power Bank with Built-in Cable",
                16900.0, 19500.0,
                "Power Banks", "UGREEN", 4.8, 110,
                "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80",
                13, true, 18, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 20000mAh 45W Fast Charging Power Bank with built-in Type-C cable and 1 Year Warranty."
        ));
        products.add(createProduct(
                "UGREEN 20000mAh 67W Fast Charging Power Bank with Built-in Type-C Cable",
                19800.0, 23000.0,
                "Power Banks", "UGREEN", 4.9, 135,
                "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
                14, true, 16, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 20000mAh 67W Fast Charging Power Bank with built-in Type-C cable and 1 Year Warranty."
        ));
        products.add(createProduct(
                "Anker 737 Power Bank (PowerCore 24K 140W)",
                39500.0, 45000.0,
                "Power Banks", "Anker", 5.0, 210,
                "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80",
                12, true, 10, "18 Months Warranty", "7 Days",
                "Ultra-powerful 140W two-way fast charging with smart digital display for laptops & phones."
        ));

        // --- 4. Chargers & Cables & Adapters ---
        products.add(createProduct(
                "UGREEN Nexode 100W 4-Port GaN Fast Charger",
                16500.0, 19500.0,
                "Chargers & Cables & Adapters", "UGREEN", 5.0, 180,
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
                15, true, 25, "1 Year Warranty", "7 Days",
                "GaN fast wall charger with 3 USB-C and 1 USB-A ports for MacBook, iPhone and Android."
        ));
        products.add(createProduct(
                "UGREEN Nexode 65W 3-Port GaN Fast Charger",
                12500.0, 14500.0,
                "Chargers & Cables & Adapters", "UGREEN", 4.9, 145,
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
                14, true, 30, "1 Year Warranty", "7 Days",
                "Compact foldable 65W fast charger capable of charging laptop and two phones simultaneously."
        ));
        products.add(createProduct(
                "Anker 735 Charger (GaNPrime 65W)",
                15500.0, 18000.0,
                "Chargers & Cables & Adapters", "Anker", 4.9, 160,
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
                14, true, 20, "18 Months Warranty", "7 Days",
                "High-speed multi-device charging with PowerIQ 4.0 and ActiveShield 2.0 safety monitoring."
        ));
        products.add(createProduct(
                "Baseus Blade 100W Ultra-Slim Charger",
                18900.0, 22500.0,
                "Chargers & Cables & Adapters", "Baseus", 4.8, 95,
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
                16, true, 14, "1 Year Warranty", "7 Days",
                "Ultra-slim high output power delivery wall charger with real-time LED power status display."
        ));
        products.add(createProduct(
                "UGREEN 100W 5A USB-C to USB-C Fast Charging Cable (2M)",
                3200.0, 4200.0,
                "Chargers & Cables & Adapters", "UGREEN", 4.9, 310,
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
                24, false, 50, "1 Year Warranty", "7 Days",
                "Durable nylon braided 100W E-marker smart chip cable for rapid laptop and phone charging."
        ));
        products.add(createProduct(
                "Anker 543 USB-C to USB-C Cable (Bio-Based 140W)",
                4500.0, 5800.0,
                "Chargers & Cables & Adapters", "Anker", 4.9, 220,
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
                22, true, 40, "18 Months Warranty", "7 Days",
                "Eco-friendly plant-based material construction tested to withstand 20,000+ bends."
        ));

        // --- 5. Earphones & Headsets ---
        products.add(createProduct(
                "Anker Soundcore Liberty 4 NC Wireless Earbuds",
                28500.0, 33500.0,
                "Earphones & Headsets", "Soundcore", 5.0, 245,
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
                15, true, 18, "18 Months Company Warranty", "7 Days",
                "98.5% noise reduction, Hi-Res wireless audio, LDAC technology and 50-hour battery life."
        ));
        products.add(createProduct(
                "Anker Soundcore Space Q45 Wireless Headphones",
                38500.0, 44000.0,
                "Earphones & Headsets", "Soundcore", 4.9, 130,
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
                12, true, 12, "18 Months Company Warranty", "7 Days",
                "Adaptive active noise cancelling over-ear headphones with ultra-long 65H playtime."
        ));
        products.add(createProduct(
                "Anker Soundcore Life P3 Noise Cancelling Earbuds",
                19500.0, 23000.0,
                "Earphones & Headsets", "Soundcore", 4.8, 190,
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
                15, false, 22, "18 Months Company Warranty", "7 Days",
                "Multi-mode ANC, thumping bass with BassUp technology and 6 microphones for clear calls."
        ));
        products.add(createProduct(
                "Anker Soundcore Liberty 5 ANC Earbuds",
                26500.0, 31000.0,
                "Earphones & Headsets", "Soundcore", 4.9, 175,
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
                15, true, 18, "18 Months Company Warranty", "7 Days",
                "Buy genuine Anker Soundcore Liberty 5 ANC Earbuds with HearID personalized sound & spatial audio."
        ));
        products.add(createProduct(
                "UGREEN HiTune Max5 Hybrid ANC Headphones",
                21500.0, 25500.0,
                "Earphones & Headsets", "UGREEN", 4.8, 98,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
                16, true, 15, "1 Year Warranty", "7 Days",
                "Hi-Res certified Bluetooth 5.0 wireless over-ear headset with dual-mic noise cancelling."
        ));

        // --- 6. Speakers ---
        products.add(createProduct(
                "JBL Flip 6 Portable Waterproof Bluetooth Speaker",
                36500.0, 42000.0,
                "Speakers", "JBL", 4.9, 180,
                "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
                13, true, 15, "1 Year Warranty", "7 Days",
                "Bold JBL Original Pro Sound with 2-way speaker system, IP67 waterproof & dustproof."
        ));
        products.add(createProduct(
                "JBL Charge 5 Wi-Fi & Bluetooth Speaker",
                52000.0, 59000.0,
                "Speakers", "JBL", 5.0, 140,
                "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
                12, true, 10, "1 Year Warranty", "7 Days",
                "20 Hours playtime with built-in powerbank to charge other portable devices on the go."
        ));
        products.add(createProduct(
                "Anker Soundcore Motion Boom Plus 80W",
                44500.0, 51000.0,
                "Speakers", "Soundcore", 4.9, 115,
                "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
                13, true, 12, "18 Months Warranty", "7 Days",
                "80W booming outdoor sound with titanium drivers, BassUp technology, and IP67 rating."
        ));

        // --- 7. Phone Cases & Back Covers ---
        products.add(createProduct(
                "Spigen Ultra Hybrid Case for iPhone 15 Pro",
                6800.0, 8200.0,
                "Phone Cases & Back Covers", "Spigen", 4.9, 185,
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
                17, true, 35, "12 Months", "7 Days",
                "Clear shock-absorption bumper case with Air Cushion Technology for iPhone 15 Pro."
        ));

        // --- 8. Screen Protectors ---
        products.add(createProduct(
                "Spigen EZ Fit Tempered Glass Guard (2-Pack)",
                4500.0, 5500.0,
                "Screen Protectors", "Spigen", 4.9, 240,
                "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80",
                18, true, 50, "12 Months", "7 Days",
                "Auto-alignment tray kit for bubble-free 9H hardness tempered glass installation."
        ));

        // --- 9. Mouse & Keyboards ---
        products.add(createProduct(
                "Logitech MX Master 3S Wireless Performance Mouse",
                34500.0, 39900.0,
                "Mouse & Keyboards", "Logitech", 4.9, 130,
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
                13, true, 14, "2 Years", "7 Days",
                "Quiet clicks, 8K DPI sensor for glass tracking, and MagSpeed scroll wheel."
        ));

        // --- 10. Pendrives & SD Cards ---
        products.add(createProduct(
                "SanDisk Extreme Pro 128GB MicroSDXC 200MB/s",
                7800.0, 9500.0,
                "Pendrives & SD Cards", "SanDisk", 4.9, 320,
                "https://images.unsplash.com/photo-1586953101226-996522c06170?w=600&auto=format&fit=crop&q=80",
                17, false, 45, "Lifetime", "7 Days",
                "High-speed A2 4K UHD MicroSD memory card for action cameras, drones & phones."
        ));

        // --- 11. Others ---
        products.add(createProduct(
                "UGREEN Aluminum Foldable Desk Phone Stand",
                2900.0, 3800.0,
                "Others", "UGREEN", 4.8, 110,
                "https://images.unsplash.com/photo-1586953101226-996522c06170?w=600&auto=format&fit=crop&q=80",
                23, true, 30, "12 Months", "7 Days",
                "Adjustable multi-angle aluminum desktop stand for smartphones and tablets."
        ));

        productRepository.saveAll(products);
        log.info("Successfully synced {} official NVSHOP.LK products across all 11 categories!", products.size());

        // Seed realistic sample orders for customers
        seedUserOrders("khimasha16@gmail.com", "Kulashi Himasha", "+94 76 227 7566", "185/1/2B New Road, Ambalangoda, Sri Lanka");
        seedUserOrders("mayanthanawarathna37@gmail.com", "Mayantha Nawarathna", "+94 72 583 5742", "185/1/2B New Road, Ambalangoda, Sri Lanka");
        seedUserOrders("hibosa972@gmail.com", "Hibosa Customer", "+94 76 989 0079", "185/1/2B New Road, Ambalangoda, Sri Lanka");
    }

    private void seedUserOrders(String email, String name, String phone, String address) {
        if (orderRepository.findByUserEmailOrderByCreatedAtDesc(email).isEmpty()) {
            log.info("Seeding realistic sample orders for {}", email);
            
            String ordNum1 = "NV-" + (Math.abs((email + "ORD1").hashCode()) % 800000 + 100000);
            String ordNum2 = "NV-" + (Math.abs((email + "ORD2").hashCode()) % 800000 + 100000);

            // Order 1: Delivered
            Order o1 = new Order();
            o1.setOrderNumber(ordNum1);
            o1.setUserEmail(email);
            o1.setCustomerName(name);
            o1.setCustomerPhone(phone);
            o1.setShippingAddress(address);
            o1.setCity("Ambalangoda");
            o1.setPostalCode("80300");
            o1.setSubtotal(23000.0);
            o1.setTax(0.0);
            o1.setShippingCost(0.0);
            o1.setTotalAmount(23000.0);
            o1.setStatus("DELIVERED");
            o1.setPaymentMethod("CARD");
            o1.setPaymentStatus("SUCCESS");

            List<OrderItem> items1 = new ArrayList<>();
            OrderItem i1 = new OrderItem();
            i1.setOrder(o1);
            i1.setProductId(1L);
            i1.setProductName("UGREEN Nexode 100W 4-Port GaN Fast Charger");
            i1.setProductImage("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80");
            i1.setPrice(16500.0);
            i1.setQuantity(1);
            i1.setSubtotal(16500.0);
            items1.add(i1);

            OrderItem i2 = new OrderItem();
            i2.setOrder(o1);
            i2.setProductId(2L);
            i2.setProductName("Apple Original 20W USB-C Power Adapter");
            i2.setProductImage("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80");
            i2.setPrice(6500.0);
            i2.setQuantity(1);
            i2.setSubtotal(6500.0);
            items1.add(i2);

            o1.setItems(items1);
            orderRepository.save(o1);

            // Order 2: In Transit / Shipped
            Order o2 = new Order();
            o2.setOrderNumber(ordNum2);
            o2.setUserEmail(email);
            o2.setCustomerName(name);
            o2.setCustomerPhone(phone);
            o2.setShippingAddress(address);
            o2.setCity("Ambalangoda");
            o2.setPostalCode("80300");
            o2.setSubtotal(26500.0);
            o2.setTax(0.0);
            o2.setShippingCost(0.0);
            o2.setTotalAmount(26500.0);
            o2.setStatus("SHIPPED");
            o2.setPaymentMethod("COD");
            o2.setPaymentStatus("PENDING");

            List<OrderItem> items2 = new ArrayList<>();
            OrderItem i3 = new OrderItem();
            i3.setOrder(o2);
            i3.setProductId(3L);
            i3.setProductName("Anker Soundcore Liberty 5 ANC Earbuds");
            i3.setProductImage("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80");
            i3.setPrice(26500.0);
            i3.setQuantity(1);
            i3.setSubtotal(26500.0);
            items2.add(i3);

            o2.setItems(items2);
            orderRepository.save(o2);
        }
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

    private void seedUserIfMissing(String email, String name, String phone, String rawPassword, String address) {
        if (!userRepository.existsByEmail(email)) {
            log.info("Seeding user account: {}", email);
            User u = new User();
            u.setName(name);
            u.setEmail(email);
            u.setPhone(phone);
            u.setAddress(address);
            u.setPassword(passwordEncoder.encode(rawPassword));
            u.setIsActive(true);
            u.setIsEmailVerified(true);
            u.setIsPhoneVerified(true);
            userRepository.save(u);
        }
    }
}
