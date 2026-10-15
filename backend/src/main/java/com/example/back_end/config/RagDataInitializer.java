package com.example.back_end.config;

import com.example.back_end.entity.ShopDetails;
import com.example.back_end.entity.ShopKnowledge;
import com.example.back_end.repository.ShopDetailsRepository;
import com.example.back_end.repository.ShopKnowledgeRepository;
import com.example.back_end.service.RagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class RagDataInitializer implements CommandLineRunner {

    private final ShopDetailsRepository shopDetailsRepository;
    private final ShopKnowledgeRepository shopKnowledgeRepository;
    private final JdbcTemplate jdbcTemplate;
    private final RagService ragService;

    @Override
    public void run(String... args) {
        setupPgVectorSchema();
        seedShopDetails();
        seedShopKnowledge();
    }

    private void setupPgVectorSchema() {
        try {
            // Enable pgvector extension in Supabase PostgreSQL
            jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS vector");
            log.info("PostgreSQL pgvector extension verified/enabled.");

            // Add vector column to shop_knowledge if not already present
            jdbcTemplate.execute("ALTER TABLE shop_knowledge ADD COLUMN IF NOT EXISTS embedding vector(768)");
            log.info("Column shop_knowledge.embedding (vector 768) verified.");
        } catch (Exception e) {
            log.warn("pgvector extension setup skipped or not supported on current database engine: {}", e.getMessage());
        }
    }

    private void seedShopDetails() {
        if (shopDetailsRepository.count() == 0) {
            log.info("Seeding master store details for NVSHOP.LK...");
            ShopDetails details = new ShopDetails();
            details.setShopName("NVSHOP.LK");
            details.setTagline("Sri Lanka's Premier Tech & Apple Accessories Store");
            details.setDescription("NVSHOP.LK is Sri Lanka's leading technology store providing 100% authentic Apple products, Anker power banks, UGREEN GaN chargers, Soundcore audio gear, and cutting-edge mobile gadgets with official warranty coverage.");
            details.setEmail("support@nvshop.lk");
            details.setSupportEmail("orders@nvshop.lk");
            details.setHotline("+94 77 123 4567");
            details.setPhoneSecondary("+94 91 225 6789");
            details.setWhatsapp("+94 77 123 4567");
            details.setAddress("185/1/2B New Road, Ambalangoda, Southern Province, Sri Lanka");
            details.setCity("Ambalangoda");
            details.setPostalCode("80300");
            details.setGoogleMapsUrl("https://maps.google.com/?q=Ambalangoda+Sri+Lanka");
            details.setBusinessHours("Monday - Saturday: 9:00 AM - 7:30 PM | Sunday: 10:00 AM - 5:00 PM | Poya Days: Closed");
            details.setWarrantyPolicy("All products carry authentic manufacturer company warranty (6 Months to 2 Years). Direct replacement for manufacturing defects within the warranty period with original receipt and packaging.");
            details.setReturnPolicy("7-day replacement warranty for manufacturing defects. Returned products must be in original condition with box, accessories, and invoice.");
            details.setShippingPolicy("Islandwide express courier delivery within 24-48 hours. Free delivery on orders over LKR 10,000. Cash on Delivery (COD) supported nationwide.");
            details.setPaymentMethods("Visa, MasterCard, Amex, Koko 3-Month Installments (BNPL 0% interest), Mintpay, Bank Transfer, and Cash on Delivery (COD).");
            details.setShowroomInfo("Visit our flagship experiential showroom at New Road, Ambalangoda featuring an interactive VR Demo Lounge and live audio testing stations.");

            shopDetailsRepository.save(details);
            log.info("Master shop details seeded successfully.");
        }
    }

    private void seedShopKnowledge() {
        if (shopKnowledgeRepository.count() == 0) {
            log.info("Seeding knowledge base chunks for RAG vector dataset...");

            List<ShopKnowledge> chunks = List.of(
                    createChunk(
                            "STORE_OVERVIEW",
                            "NVSHOP.LK Store Location, Contact & Opening Hours",
                            "NVSHOP.LK is located at 185/1/2B New Road, Ambalangoda (Postal Code: 80300), Sri Lanka. " +
                                    "Our official customer hotline and WhatsApp support is +94 77 123 4567. Secondary phone: +94 91 225 6789. " +
                                    "Customer support email: support@nvshop.lk, orders email: orders@nvshop.lk. " +
                                    "Opening hours are Monday to Saturday from 9:00 AM to 7:30 PM, and Sunday from 10:00 AM to 5:00 PM. We are closed on Poya Days."
                    ),
                    createChunk(
                            "WARRANTY_POLICY",
                            "Official Warranty Policies and Claim Procedures",
                            "Every product sold at NVSHOP.LK comes with verified authentic company warranty: " +
                                    "Anker and Soundcore audio/chargers: 18 Months Company Warranty. " +
                                    "UGREEN chargers and power banks: 1 Year Warranty. " +
                                    "Apple devices & genuine adapters: 1 Year Official AppleCare Warranty. " +
                                    "Smart watches (Green Lion, Black Shark, WiWU, Haylou): 6 Months Warranty. " +
                                    "Warranty claims can be submitted directly at our Ambalangoda showroom or dispatched via courier with the original invoice."
                    ),
                    createChunk(
                            "SHIPPING_DELIVERY",
                            "Islandwide Courier Delivery Rates & Delivery Times",
                            "NVSHOP.LK delivers to all 25 districts across Sri Lanka via express courier partners. " +
                                    "Colombo and suburbs: Delivery within 24 hours. " +
                                    "Outstation and regional areas: Delivery within 24 to 48 hours. " +
                                    "Standard shipping fee is LKR 450. Delivery is completely FREE for all orders over LKR 10,000. " +
                                    "Cash on Delivery (COD) is available islandwide for convenient payment upon receiving your package."
                    ),
                    createChunk(
                            "PAYMENT_METHODS",
                            "Payment Options and Koko Buy-Now-Pay-Later (BNPL)",
                            "We provide flexible, secure payment methods: " +
                                    "1. Cash on Delivery (COD) across Sri Lanka. " +
                                    "2. Visa, MasterCard, and American Express cards via secure PayHere gateway. " +
                                    "3. Koko BNPL: Split your total payment into 3 equal monthly installments with 0% interest using any debit or credit card. " +
                                    "4. Mintpay 3-month installment plans. " +
                                    "5. Direct Bank Transfer (Commercial Bank / Sampath Bank)."
                    ),
                    createChunk(
                            "SHOWROOM_VR",
                            "Experiential Showroom and Interactive VR Demo Lounge",
                            "NVSHOP.LK features Sri Lanka's first experiential tech store in Ambalangoda. " +
                                    "Customers can visit our showroom to try premium headphones, test wireless earbuds at live sound stations, " +
                                    "and experience interactive Virtual Reality demos (Apple Vision Pro and Meta Quest 3). " +
                                    "Our tech specialists offer free unboxing and device setup assistance on-site."
                    ),
                    createChunk(
                            "RETURN_REFUND",
                            "7-Day Return and Replacement Guarantee",
                            "If you encounter any manufacturing fault within 7 days of receiving your order, NVSHOP.LK provides a brand new 1-to-1 replacement. " +
                                    "To qualify, items must be returned with the original retail packaging, cables, manuals, and proof of purchase. " +
                                    "Physical damage, water damage, or electrical burns caused by power surges are not covered under warranty."
                    ),
                    createChunk(
                            "AUTHENTICITY",
                            "100% Genuine and Authentic Tech Guarantee",
                            "NVSHOP.LK guarantees that every item sold is 100% genuine and sourced from authorized regional distributors. " +
                                    "All Apple devices feature valid serial numbers verifiable on the official Apple checkcoverage portal. " +
                                    "Anker, UGREEN, and Baseus items feature original holographic authentication scratch codes."
                    )
            );

            shopKnowledgeRepository.saveAll(chunks);
            log.info("Seeded {} knowledge chunks successfully.", chunks.size());

            // Attempt batch embedding if GEMINI_API_KEY is configured
            try {
                ragService.syncEmbeddings();
            } catch (Exception e) {
                log.info("Initial embedding sync note: {}", e.getMessage());
            }
        }
    }

    private ShopKnowledge createChunk(String category, String title, String content) {
        ShopKnowledge sk = new ShopKnowledge();
        sk.setCategory(category);
        sk.setTitle(title);
        sk.setContent(content);
        return sk;
    }
}
