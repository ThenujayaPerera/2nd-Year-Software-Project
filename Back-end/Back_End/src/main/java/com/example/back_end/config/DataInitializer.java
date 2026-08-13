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

        // Clean & Sync exact live products and photo assets from official nvshop.lk
        log.info("Syncing exact NVSHOP.LK catalog, official product images, and details...");
        productRepository.deleteAll();

        List<Product> products = new ArrayList<>();

        // --- 1. Apple iPhone ---
        products.add(createProduct(
                "Apple iPhone 17 Pro Max 256GB (X/A)",
                445000.0, 465000.0,
                "Apple iPhone", "Apple", 5.0, 42,
                "https://api.nvshop.lk/api/public/file/6a113bc506fdb61b1b19f7d7/16-pro-6.jpg",
                4, true, 5, "1 Year Apple Care", "7 Days",
                "Buy genuine Apple iPhone 17 Pro Max 256GB (X/A) with Apple warranty at NVSHOP.LK Sri Lanka."
        ));
        products.add(createProduct(
                "Apple Original 20W USB-C Power Adapter",
                6500.0, 7500.0,
                "Apple iPhone", "Apple", 4.9, 195,
                "https://api.nvshop.lk/api/public/file/69a966d647ef868f0adc57fe/4abd5f98ce6569be4b94056c4e52a064.jpg_960x960q80.jpg_.webp",
                13, true, 20, "1 Year", "7 Days",
                "Genuine Apple 20W fast charging wall adapter for iPhone 11, 12, 13, 14, 15, 16 series."
        ));

        // --- 2. Smart Watches ---
        products.add(createProduct(
                "Green Lion Gravix Smart Watch",
                14500.0, 16500.0,
                "Smart Watches", "Green Lion", 4.8, 64,
                "https://api.nvshop.lk/api/public/file/69c61f343cafeb520d7bbc5d/Green-Lion-Gravix-Smart-Watch-by-appleme.lk-4.webp",
                12, true, 15, "6 Months Warranty", "7 Days",
                "Buy genuine Green Lion Gravix Smart Watch with AMOLED Display and Bluetooth calling at NVSHOP.LK Sri Lanka."
        ));
        products.add(createProduct(
                "Green Lion Active SE Smart Watch",
                12800.0, 14900.0,
                "Smart Watches", "Green Lion", 4.7, 48,
                "https://api.nvshop.lk/api/public/file/69c61e1e3cafeb520d7bbc25/download (5).jfif",
                14, true, 18, "6 Months Warranty", "7 Days",
                "Buy genuine Green Lion Active SE Smart Watch with fitness tracking and heart rate monitor."
        ));
        products.add(createProduct(
                "Black Shark S3 Smart Watch",
                16900.0, 19500.0,
                "Smart Watches", "Black Shark", 4.9, 72,
                "https://api.nvshop.lk/api/public/file/69c61d873cafeb520d7bbbee/download (10).jfif",
                13, true, 12, "6 Months Warranty", "7 Days",
                "Buy genuine Black Shark S3 Smart Watch with ultra-clear display and gaming styling."
        ));
        products.add(createProduct(
                "Green Lion Hilux Smart Watch",
                13900.0, 15900.0,
                "Smart Watches", "Green Lion", 4.7, 39,
                "https://api.nvshop.lk/api/public/file/69c61d253cafeb520d7bbbb8/download (13).jfif",
                12, false, 14, "6 Months Warranty", "7 Days",
                "Buy genuine Green Lion Hilux Smart Watch with long battery life and premium metallic body."
        ));
        products.add(createProduct(
                "Black Shark A3 Smart Watch",
                15500.0, 17900.0,
                "Smart Watches", "Black Shark", 4.8, 51,
                "https://api.nvshop.lk/api/public/file/69c61cc83cafeb520d7bbb83/download (14).jfif",
                13, true, 10, "6 Months Warranty", "7 Days",
                "Buy genuine Black Shark A3 Smart Watch with sports modes and IP68 waterproof rating."
        ));
        products.add(createProduct(
                "Green Lion Ridge Smart Watch",
                14200.0, 16000.0,
                "Smart Watches", "Green Lion", 4.8, 33,
                "https://api.nvshop.lk/api/public/file/69c61a8e3cafeb520d7bba49/Green-Lion-GL-SWA53-Ridge-Smart-Watch-Green-Brown-by-otc.lk-in-srilanka.webp",
                11, false, 12, "6 Months Warranty", "7 Days",
                "Buy genuine Green Lion Ridge Smart Watch with dual-color strap and rugged bezel."
        ));
        products.add(createProduct(
                "WiWU SW05 Smart Watch",
                11500.0, 13500.0,
                "Smart Watches", "WiWU", 4.6, 28,
                "https://api.nvshop.lk/api/public/file/69c61a463cafeb520d7bba16/wiwu 3.jfif",
                15, true, 16, "6 Months Warranty", "7 Days",
                "Buy genuine WiWU SW05 Smart Watch with sleek lightweight design and HD touchscreen."
        ));
        products.add(createProduct(
                "Haylou RS5 Smart Watch",
                13500.0, 15500.0,
                "Smart Watches", "Haylou", 4.7, 45,
                "https://api.nvshop.lk/api/public/file/69c619693cafeb520d7bb9e4/download (2).jfif",
                13, true, 15, "6 Months Warranty", "7 Days",
                "Buy genuine Haylou RS5 Smart Watch with 2.01 inch AMOLED display and aerospace metallic frame."
        ));
        products.add(createProduct(
                "Black Shark GT3 Neo Smart Watch",
                12900.0, 14800.0,
                "Smart Watches", "Black Shark", 4.7, 36,
                "https://api.nvshop.lk/api/public/file/69c618ec3cafeb520d7bb998/download (1).jfif",
                13, false, 20, "6 Months Warranty", "7 Days",
                "Buy genuine Black Shark GT3 Neo with curved display and AI voice assistant."
        ));
        products.add(createProduct(
                "Black Shark Watch S1",
                17500.0, 19900.0,
                "Smart Watches", "Black Shark", 4.9, 89,
                "https://api.nvshop.lk/api/public/file/69c617ba3cafeb520d7bb94a/download.jfif",
                12, true, 11, "6 Months Warranty", "7 Days",
                "Buy genuine Black Shark Watch S1 with 1.43 AMOLED display, ENC Bluetooth calling."
        ));

        // --- 3. Power Banks ---
        products.add(createProduct(
                "UGREEN 300W 48000mAh Smart Digital Display Power Bank",
                58000.0, 65000.0,
                "Power Banks", "UGREEN", 5.0, 94,
                "https://api.nvshop.lk/api/public/file/69b3a061671bdc237efeb925/H7b50569eb1f84a60bd970ef6924a7418Y.avif",
                11, true, 8, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 300W 48000mAh Smart Digital Display Power Bank with 1 Year Warranty at NVSHOP.LK."
        ));
        products.add(createProduct(
                "UGREEN 20000mAh 30W Fast Charging Power Bank",
                12800.0, 15500.0,
                "Power Banks", "UGREEN", 4.9, 142,
                "https://api.nvshop.lk/api/public/file/69b3a010671bdc237efeb8f7/24727d81-b4bc-4bbd-bdbb-3949a1b4d899.jpg.webp",
                17, true, 25, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 20000mAh 30W Fast Charging Power Bank with 1 Year Warranty at NVSHOP.LK."
        ));
        products.add(createProduct(
                "UGREEN 20000mAh 165W Fast Charging Power Bank",
                28500.0, 33000.0,
                "Power Banks", "UGREEN", 4.9, 87,
                "https://api.nvshop.lk/api/public/file/69b39f53671bdc237efeb8ca/UGREEN-55987b-Nexode-Power-Bank-20000mAh-165Wb-by-appleme.lk-1.webp",
                14, true, 12, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 20000mAh 165W Fast Charging Power Bank with 1 Year Warranty at NVSHOP.LK."
        ));
        products.add(createProduct(
                "UGREEN 20000mAh 45W Fast Charging Power Bank with Built-in Cable",
                16900.0, 19500.0,
                "Power Banks", "UGREEN", 4.8, 110,
                "https://api.nvshop.lk/api/public/file/69b39efa671bdc237efeb89e/UGREEN-45W-Power-Bank-with-Built-in-Cable--PB536--55988B--1-Year-Warranty-ugreenlk-9.webp",
                13, true, 18, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 20000mAh 45W Fast Charging Power Bank with built-in Type-C cable and 1 Year Warranty."
        ));
        products.add(createProduct(
                "UGREEN 20000mAh 67W Fast Charging Power Bank with Built-in Type-C Cable",
                19800.0, 23000.0,
                "Power Banks", "UGREEN", 4.9, 135,
                "https://api.nvshop.lk/api/public/file/69b39e8a671bdc237efeb852/UGREEN-20000mAh-67W-Power-Bank-with-Built-in-Type-C-Cable-PB550-â€“-55996B-â€“-1-Year-Warranty-1024x1024.webp",
                14, true, 16, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 20000mAh 67W Fast Charging Power Bank with 1 Year Warranty at NVSHOP.LK."
        ));
        products.add(createProduct(
                "UGREEN 20000mAh 20W Fast Charging Power Bank",
                10900.0, 13000.0,
                "Power Banks", "UGREEN", 4.8, 160,
                "https://api.nvshop.lk/api/public/file/69b39e28671bdc237efeb805/rn-image_picker_lib_temp_eabe4a72-d3be-4012-800f-b51ac3b2dbd0.webp",
                16, false, 30, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 20000mAh 20W Fast Charging Power Bank with 1 Year Warranty."
        ));
        products.add(createProduct(
                "UGREEN 25000mAh 145W Fast Charging Power Bank",
                29900.0, 35000.0,
                "Power Banks", "UGREEN", 4.9, 210,
                "https://api.nvshop.lk/api/public/file/69b39d16671bdc237efeb703/WhatsApp-Image-2025-07-18-at-14.32.16.jpeg",
                15, true, 14, "1 Year Warranty", "7 Days",
                "Buy genuine UGREEN 25000mAh 145W Fast Charging Power Bank for MacBooks, laptops & phones."
        ));
        products.add(createProduct(
                "Baseus Magnetic Mini Power Bank 10000mAh 30W",
                11500.0, 13800.0,
                "Power Banks", "Baseus", 4.8, 98,
                "https://api.nvshop.lk/api/public/file/69b39998671bdc237efeb668/3144683_baseus-magnetic-mini-power-bank-10000mah-30w-kek.webp",
                17, true, 22, "1 Year Warranty", "7 Days",
                "Buy genuine Baseus Magnetic Mini Power Bank 10000mAh 30W MagSafe compatible with 1 Year Warranty."
        ));
        products.add(createProduct(
                "Anker PowerCore III Elite 26K 60W Power Bank",
                36500.0, 42000.0,
                "Power Banks", "Anker", 4.9, 82,
                "https://api.nvshop.lk/api/public/file/69b3940e671bdc237efeaff8/Anker-PowerCore-III-Elite-25600mAh-87W-USB-C-PD-Portable-Charger-6.webp",
                13, false, 9, "6 Months Warranty", "7 Days",
                "Buy genuine Anker PowerCore III Elite 25600mAh 60W Power Bank at NVSHOP.LK Sri Lanka."
        ));
        products.add(createProduct(
                "Anker Power Bank 25K 165W with Built-In & Retractable Cables",
                38900.0, 45000.0,
                "Power Banks", "Anker", 5.0, 150,
                "https://api.nvshop.lk/api/public/file/69b392bc671bdc237efeaf58/A1695H11_MRC_PRC_Rich_image_EN_V1_2.webp",
                14, true, 15, "18 Months Company Warranty", "7 Days",
                "Buy genuine Anker Power Bank 25K 165W with Built-In & Retractable Cables with 18 Months Company Warranty."
        ));
        products.add(createProduct(
                "Baseus Bipow 2 20W 10000mAh Digital Display Power Bank",
                7900.0, 9500.0,
                "Power Banks", "Baseus", 4.8, 180,
                "https://api.nvshop.lk/api/public/file/69b1453ec8cd3fa49255398c/Baseus-Bipow-2-20W-10000mah-Digital-Display-Power-Bank-2.webp",
                17, false, 35, "1 Year Warranty", "7 Days",
                "Buy genuine Baseus Bipow 2 20W 10000mAh Digital Display Power Bank at NVSHOP.LK."
        ));
        products.add(createProduct(
                "Baseus QPOW Digital Display Power Bank 10000mAh 15W",
                8500.0, 10200.0,
                "Power Banks", "Baseus", 4.7, 125,
                "https://api.nvshop.lk/api/public/file/69b14443c8cd3fa49255390a/Baseus-QPOW-Digital-Display-Power-Bank-IP-Edition-2022-Edition-10000mAh-15w-img3.webp",
                17, true, 20, "1 Year Warranty", "7 Days",
                "Buy genuine Baseus QPOW Digital Display Power Bank 10000mAh 15W with built-in cable."
        ));
        products.add(createProduct(
                "Baseus 10000mAh 22.5W Qpow Pro Digital Display Fast Charge",
                9800.0, 11900.0,
                "Power Banks", "Baseus", 4.8, 140,
                "https://api.nvshop.lk/api/public/file/69b1419dc8cd3fa4925536ee/Baseus-PPQD020101-vc2.webp",
                18, true, 25, "1 Year Warranty", "7 Days",
                "Buy genuine Baseus 10000mAh 22.5W Qpow Pro Digital Display Fast Charge Power Bank."
        ));
        products.add(createProduct(
                "Baseus EnerFill FM11 10000mAh 22.5W Magnetic Power Bank",
                12500.0, 14800.0,
                "Power Banks", "Baseus", 4.8, 77,
                "https://api.nvshop.lk/api/public/file/69b1097647ef868f0adc97a5/baseus-enerfill-fm11-225w-10000mah-magnetic-wireless-power-bank-RlhsO_AHiI0z.webp",
                16, true, 18, "1 Year Warranty", "7 Days",
                "Buy genuine Baseus EnerFill FM11 10000mAh 22.5W Magnetic Wireless Power Bank."
        ));
        products.add(createProduct(
                "Baseus Star-Lord 30000mAh 22.5W Fast Charging Power Bank",
                15800.0, 18500.0,
                "Power Banks", "Baseus", 4.9, 165,
                "https://api.nvshop.lk/api/public/file/69b1084447ef868f0adc96df/Baseus_Star-Lord_Power_Bank_22.5W_30000mAh_PPXJ0801012_1200x.webp",
                15, true, 20, "1 Year Warranty", "7 Days",
                "Buy genuine Baseus Star-Lord 30000mAh 22.5W Fast Charging Power Bank with 1 Year Warranty."
        ));
        products.add(createProduct(
                "Baseus Bipow 30000mAh 20W Digital Display Power Bank",
                14500.0, 17200.0,
                "Power Banks", "Baseus", 4.8, 190,
                "https://api.nvshop.lk/api/public/file/69a96a8147ef868f0adc59b0/1-1.webp",
                16, false, 24, "1 Year Warranty", "7 Days",
                "Buy genuine Baseus Bipow 30000mAh 20W Digital Display Power Bank with 1 Year Warranty."
        ));
        products.add(createProduct(
                "Baseus Bipow 20000mAh 25W Fast Charging Power Bank",
                11900.0, 13900.0,
                "Power Banks", "Baseus", 4.8, 145,
                "https://api.nvshop.lk/api/public/file/69a969b947ef868f0adc5936/146055_6-1000x1000afac.jpg",
                14, false, 28, "1 Year Warranty", "7 Days",
                "Buy genuine Baseus Bipow 20000mAh 25W Fast Charging Power Bank with 1 Year Warranty."
        ));
        products.add(createProduct(
                "Anker Zolo 20000mAh 22.5W Fast Charging Power Bank",
                14800.0, 17500.0,
                "Power Banks", "Anker", 4.9, 215,
                "https://api.nvshop.lk/api/public/file/69a9687847ef868f0adc58c3/A110E_Webcover.webp",
                15, true, 30, "18 Months Company Warranty", "7 Days",
                "Buy genuine Anker Zolo 20000mAh 22.5W Fast Charging Power Bank with 18 Months Company Warranty."
        ));

        // --- 4. Speakers ---
        products.add(createProduct(
                "JBL Charge 6 Portable Bluetooth Speaker",
                48000.0, 54000.0,
                "Speakers", "JBL", 4.9, 95,
                "https://api.nvshop.lk/api/public/file/69b11096c8cd3fa49255327f/download (1).jfif",
                11, true, 10, "6 Months Warranty", "7 Days",
                "Buy genuine JBL Charge 6 Portable Bluetooth Speaker with waterproof design & powerbank feature."
        ));
        products.add(createProduct(
                "JBL Flip 7 Portable Bluetooth Speaker",
                36000.0, 41000.0,
                "Speakers", "JBL", 4.9, 135,
                "https://api.nvshop.lk/api/public/file/69b3a157671bdc237efeba4c/JBL_FLIP_7_speaker-simplytek-lk-sri-lanka_1.jpg",
                12, true, 14, "6 Months Warranty", "7 Days",
                "Buy genuine JBL Flip 7 Portable Bluetooth Speaker with crystal clear stereo audio & deep bass."
        ));
        products.add(createProduct(
                "JBL Clip 5 Portable Bluetooth Speaker",
                19500.0, 22500.0,
                "Speakers", "JBL", 4.8, 88,
                "https://api.nvshop.lk/api/public/file/69b10d3847ef868f0adc98f2/JBL-CLIP5-BLK-TTC-1--1765866515.jpg",
                13, true, 18, "6 Months Warranty", "7 Days",
                "Buy genuine JBL Clip 5 Portable Bluetooth Speaker with ultra-portable carabiner clip design."
        ));
        products.add(createProduct(
                "JBL Go 3 Portable Bluetooth Speaker",
                13800.0, 16000.0,
                "Speakers", "JBL", 4.8, 170,
                "https://api.nvshop.lk/api/public/file/69b10c5347ef868f0adc98ae/JBL-GO-3-7.jpg",
                14, false, 25, "6 Months Warranty", "7 Days",
                "Buy genuine JBL Go 3 Portable Bluetooth Speaker with IP67 water and dust resistance."
        ));

        // --- 5. Chargers & Cables & Adapters ---
        products.add(createProduct(
                "Anker 30W USB-C Fast Charger Adapter",
                7500.0, 8900.0,
                "Chargers & Cables & Adapters", "Anker", 4.9, 180,
                "https://api.nvshop.lk/api/public/file/69a9675447ef868f0adc5835/715hWhF5crL._AC_SL1500_.webp",
                16, true, 35, "18 Months Company Warranty", "7 Days",
                "Buy genuine Anker 30W USB-C Fast Charger Adapter with 18 Months Company Warranty at NVSHOP.LK."
        ));
        products.add(createProduct(
                "Anker 20W USB-C Fast Charger Adapter",
                5800.0, 6900.0,
                "Chargers & Cables & Adapters", "Anker", 4.9, 240,
                "https://api.nvshop.lk/api/public/file/69a966d647ef868f0adc57fe/4abd5f98ce6569be4b94056c4e52a064.jpg_960x960q80.jpg_.webp",
                16, true, 40, "18 Months Company Warranty", "7 Days",
                "Buy genuine Anker 20W USB-C Fast Charger Adapter with 18 Months Company Warranty at NVSHOP.LK."
        ));

        // --- 6. Earphones & Headsets ---
        products.add(createProduct(
                "Soundcore Space One Wireless Noise Cancelling Headphones",
                33500.0, 38000.0,
                "Earphones & Headsets", "Soundcore", 4.9, 140,
                "https://api.nvshop.lk/api/public/file/69a9660e47ef868f0adc57d5/A3035_2_670x670_9c6f9b44-5314-4ee9-b2a2-c2d8f4acaceb.webp",
                12, true, 15, "18 Months Company Warranty", "7 Days",
                "Buy genuine Soundcore Space One Wireless Noise Cancelling Headphones with 2X stronger voice reduction."
        ));
        products.add(createProduct(
                "Soundcore Q11i Wireless Over-Ear Headphones",
                18900.0, 22500.0,
                "Earphones & Headsets", "Soundcore", 4.8, 115,
                "https://api.nvshop.lk/api/public/file/69a9656a47ef868f0adc57a3/Anker-Soundcore-Q11i-Simplytek-lk-sri-lanka_2.webp",
                16, true, 20, "18 Months Company Warranty", "7 Days",
                "Buy genuine Soundcore Q11i Wireless Over-Ear Headphones with 60-hour long battery life."
        ));
        products.add(createProduct(
                "Soundcore Liberty 4 NC True Wireless Noise Cancelling Earbuds",
                24500.0, 28900.0,
                "Earphones & Headsets", "Soundcore", 5.0, 260,
                "https://api.nvshop.lk/api/public/file/69a9640447ef868f0adc575f/gq-mobiles-anker-liberty-4-nc-4nc-noise-cancellation-in-ear-wireless-earbuds-earpods-specifications-details-4.png",
                15, true, 25, "18 Months Company Warranty", "7 Days",
                "Buy genuine Soundcore Liberty 4 NC with 98.5% noise reduction and Hi-Res wireless audio."
        ));
        products.add(createProduct(
                "Anker R50i NC True Wireless Earbuds",
                8900.0, 10500.0,
                "Earphones & Headsets", "Anker", 4.9, 320,
                "https://api.nvshop.lk/api/public/file/69a962a247ef868f0adc56e1/Anker-soundcore-r50i-nc-simplytek-lk-sri-lanka.webp",
                15, true, 40, "18 Months Company Warranty", "7 Days",
                "Buy genuine Anker R50i NC with 42dB active noise cancellation and 4-mic crystal clear calls."
        ));
        products.add(createProduct(
                "Anker Soundcore P20i True Wireless Earbuds",
                6900.0, 8200.0,
                "Earphones & Headsets", "Anker", 4.8, 280,
                "https://api.nvshop.lk/api/public/file/69a9614c47ef868f0adc55dc/anker-soundcore-r50i-true-wireless-earbuds-original-17073513534473124.webp",
                16, false, 50, "18 Months Company Warranty", "7 Days",
                "Buy genuine Anker Soundcore P20i with 10mm drivers, punchy bass, and 30-hour playtime."
        ));
        products.add(createProduct(
                "Anker Soundcore K20i TWS Semi-In-Ear Earbuds",
                5500.0, 6800.0,
                "Earphones & Headsets", "Anker", 4.7, 190,
                "https://api.nvshop.lk/api/public/file/69a95fe747ef868f0adc5540/brd-00816_anker-soundcore-k20i-tws-semi-in-ear-bluetooth-gaming-mode-low-latency-earbuds-a3994_full07-29b407c2.jpg",
                19, true, 30, "6 Months Warranty", "7 Days",
                "Buy genuine Anker Soundcore K20i semi-in-ear earbuds with gaming low latency mode."
        ));
        products.add(createProduct(
                "Anker Soundcore Liberty 5 ANC Earbuds",
                26500.0, 31000.0,
                "Earphones & Headsets", "Soundcore", 4.9, 175,
                "https://api.nvshop.lk/api/public/file/69a54a7b47ef868f0adc4ada/download (1).jfif",
                15, true, 18, "18 Months Company Warranty", "7 Days",
                "Buy genuine Anker Soundcore Liberty 5 ANC Earbuds with HearID personalized sound & spatial audio."
        ));

        // --- 7. Phone Cases & Back Covers ---
        products.add(createProduct(
                "Spigen Ultra Hybrid Case for iPhone 15 Pro",
                6800.0, 8200.0,
                "Phone Cases & Back Covers", "Spigen", 4.9, 185,
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600",
                17, true, 35, "12 Months", "7 Days",
                "Clear shock-absorption bumper case with Air Cushion Technology for iPhone 15 Pro."
        ));

        // --- 8. Screen Protectors ---
        products.add(createProduct(
                "Spigen EZ Fit Tempered Glass Guard (2-Pack)",
                4500.0, 5500.0,
                "Screen Protectors", "Spigen", 4.9, 240,
                "https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600",
                18, true, 50, "12 Months", "7 Days",
                "Auto-alignment tray kit for bubble-free 9H hardness tempered glass installation."
        ));

        // --- 9. Mouse & Keyboards ---
        products.add(createProduct(
                "Logitech MX Master 3S Wireless Performance Mouse",
                34500.0, 39900.0,
                "Mouse & Keyboards", "Logitech", 4.9, 130,
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
                13, true, 14, "2 Years", "7 Days",
                "Quiet clicks, 8K DPI sensor for glass tracking, and MagSpeed scroll wheel."
        ));

        // --- 10. Pendrives & SD Cards ---
        products.add(createProduct(
                "SanDisk Extreme Pro 128GB MicroSDXC 200MB/s",
                7800.0, 9500.0,
                "Pendrives & SD Cards", "SanDisk", 4.9, 320,
                "https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600",
                17, false, 45, "Lifetime", "7 Days",
                "High-speed A2 4K UHD MicroSD memory card for action cameras, drones & phones."
        ));

        // --- 11. Others ---
        products.add(createProduct(
                "UGREEN Aluminum Foldable Desk Phone Stand",
                2900.0, 3800.0,
                "Others", "UGREEN", 4.8, 110,
                "https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600",
                23, true, 30, "12 Months", "7 Days",
                "Adjustable multi-angle aluminum desktop stand for smartphones and tablets."
        ));

        productRepository.saveAll(products);
        log.info("Successfully synced {} official NVSHOP.LK products across all 11 categories!", products.size());
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
