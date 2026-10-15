package com.example.back_end.controller;

import com.example.back_end.entity.ShopDetails;
import com.example.back_end.repository.ShopDetailsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ShopController {

    private final ShopDetailsRepository shopDetailsRepository;

    /**
     * Public endpoint to get comprehensive store details
     */
    @GetMapping("/shop/details")
    public ResponseEntity<ShopDetails> getShopDetails() {
        Optional<ShopDetails> detailsOpt = shopDetailsRepository.findFirstByOrderByIdAsc();
        if (detailsOpt.isPresent()) {
            return ResponseEntity.ok(detailsOpt.get());
        }

        // Return default NVSHOP.LK store profile if database table is not yet seeded
        ShopDetails fallback = new ShopDetails();
        fallback.setId(1L);
        fallback.setShopName("NVSHOP.LK");
        fallback.setTagline("Sri Lanka's Premier Tech & Apple Accessories Store");
        fallback.setDescription("NVSHOP.LK is Sri Lanka's leading retailer for 100% authentic tech accessories, Apple products, fast chargers, power banks, and premium audio gear with direct company warranties.");
        fallback.setEmail("support@nvshop.lk");
        fallback.setSupportEmail("orders@nvshop.lk");
        fallback.setHotline("+94 77 123 4567");
        fallback.setPhoneSecondary("+94 91 225 6789");
        fallback.setWhatsapp("+94 77 123 4567");
        fallback.setAddress("185/1/2B New Road, Ambalangoda, Sri Lanka");
        fallback.setCity("Ambalangoda");
        fallback.setPostalCode("80300");
        fallback.setGoogleMapsUrl("https://maps.google.com/?q=Ambalangoda+Sri+Lanka");
        fallback.setBusinessHours("Monday - Saturday: 9:00 AM - 7:30 PM | Sunday: 10:00 AM - 5:00 PM | Poya Days: Closed");
        fallback.setWarrantyPolicy("All products carry authentic manufacturer company warranty (6 Months to 2 Years). Direct replacement for manufacturing defects within warranty period with original receipt.");
        fallback.setReturnPolicy("7-day replacement warranty for manufacturing defects. Items must be in original sealed condition with box and accessories.");
        fallback.setShippingPolicy("Islandwide express delivery within 24-48 hours. Free delivery for orders above LKR 10,000. Cash on Delivery (COD) available islandwide.");
        fallback.setPaymentMethods("Visa, MasterCard, Amex, Koko 3-Month Installments (BNPL), Mintpay, Bank Transfer, Cash on Delivery (COD).");
        fallback.setShowroomInfo("Visit our flagship experiential showroom at New Road, Ambalangoda featuring an interactive VR demo lounge and hands-on audio listening stations.");

        return ResponseEntity.ok(fallback);
    }

    /**
     * Admin endpoint to update store details
     */
    @PutMapping("/admin/shop/details")
    public ResponseEntity<?> updateShopDetails(@RequestBody ShopDetails updated) {
        Optional<ShopDetails> existingOpt = shopDetailsRepository.findFirstByOrderByIdAsc();
        ShopDetails entity = existingOpt.orElseGet(ShopDetails::new);

        entity.setShopName(updated.getShopName());
        entity.setTagline(updated.getTagline());
        entity.setDescription(updated.getDescription());
        entity.setEmail(updated.getEmail());
        entity.setSupportEmail(updated.getSupportEmail());
        entity.setHotline(updated.getHotline());
        entity.setPhoneSecondary(updated.getPhoneSecondary());
        entity.setWhatsapp(updated.getWhatsapp());
        entity.setAddress(updated.getAddress());
        entity.setCity(updated.getCity());
        entity.setPostalCode(updated.getPostalCode());
        entity.setGoogleMapsUrl(updated.getGoogleMapsUrl());
        entity.setBusinessHours(updated.getBusinessHours());
        entity.setWarrantyPolicy(updated.getWarrantyPolicy());
        entity.setReturnPolicy(updated.getReturnPolicy());
        entity.setShippingPolicy(updated.getShippingPolicy());
        entity.setPaymentMethods(updated.getPaymentMethods());
        entity.setShowroomInfo(updated.getShowroomInfo());

        ShopDetails saved = shopDetailsRepository.save(entity);
        log.info("Updated shop details successfully: ID={}", saved.getId());
        return ResponseEntity.ok(saved);
    }
}
