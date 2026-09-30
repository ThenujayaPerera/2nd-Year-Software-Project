package com.example.back_end.controller;

import com.example.back_end.dto.UserCreateDTO;
import com.example.back_end.dto.UserDTO;
import com.example.back_end.entity.Order;
import com.example.back_end.entity.PaymentTransaction;
import com.example.back_end.entity.Product;
import com.example.back_end.repository.OrderRepository;
import com.example.back_end.repository.PaymentTransactionRepository;
import com.example.back_end.repository.ProductRepository;
import com.example.back_end.service.OrderService;
import com.example.back_end.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class AdminController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final ProductRepository productRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    // --- FR2.4: Orders Management ---
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // --- FR2.8: Customer & Administrator Accounts Management ---
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users/create-admin")
    public ResponseEntity<UserDTO> createAdmin(@RequestBody UserCreateDTO userCreateDTO) {
        log.info("Admin creating new administrator: {}", userCreateDTO.getEmail());
        return ResponseEntity.ok(userService.createAdminUser(userCreateDTO));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<UserDTO> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }

    @PutMapping("/users/{id}/toggle-role")
    public ResponseEntity<UserDTO> toggleUserRole(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserRole(id));
    }

    // --- FR2.6 & FR2.7: Sales, Revenue & Low Stock Reports ---
    @GetMapping("/reports/sales")
    public ResponseEntity<Map<String, Object>> getSalesReports() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        List<Product> products = productRepository.findAll();

        double totalRevenue = orders.stream()
                .filter(o -> "SUCCESS".equalsIgnoreCase(o.getPaymentStatus()) || "DELIVERED".equalsIgnoreCase(o.getStatus()))
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                .sum();

        // FR2.6: Low stock alert threshold (stock <= 5)
        List<Product> lowStockProducts = products.stream()
                .filter(p -> p.getStock() != null && p.getStock() <= 5)
                .collect(Collectors.toList());

        long totalOrders = orders.size();
        long pendingOrders = orders.stream().filter(o -> "PENDING".equalsIgnoreCase(o.getStatus()) || "PROCESSING".equalsIgnoreCase(o.getStatus())).count();
        long completedOrders = orders.stream().filter(o -> "DELIVERED".equalsIgnoreCase(o.getStatus())).count();

        Map<String, Object> report = new HashMap<>();
        report.put("totalRevenue", totalRevenue);
        report.put("totalOrders", totalOrders);
        report.put("pendingOrders", pendingOrders);
        report.put("completedOrders", completedOrders);
        report.put("totalProducts", products.size());
        report.put("lowStockCount", lowStockProducts.size());
        report.put("lowStockProducts", lowStockProducts);

        return ResponseEntity.ok(report);
    }

    // --- FR3.3: Payment Transactions Log ---
    @GetMapping("/payments")
    public ResponseEntity<List<PaymentTransaction>> getPaymentTransactions() {
        return ResponseEntity.ok(paymentTransactionRepository.findAllByOrderByCreatedAtDesc());
    }
}
