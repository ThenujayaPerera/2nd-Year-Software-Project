package com.example.back_end.controller;

import com.example.back_end.dto.UserCreateDTO;
import com.example.back_end.dto.UserDTO;
import com.example.back_end.entity.Order;
import com.example.back_end.entity.PaymentTransaction;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.Admin;
import com.example.back_end.repository.OrderRepository;
import com.example.back_end.repository.PaymentTransactionRepository;
import com.example.back_end.repository.ProductRepository;
import com.example.back_end.repository.AdminRepository;
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
    private final AdminRepository adminRepository;

    // --- FR2.4: Orders Management ---
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String notes = body.get("notes");
        String updatedBy = body.get("updatedBy");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status, notes, updatedBy));
    }

    @GetMapping("/orders/{id}/history")
    public ResponseEntity<List<com.example.back_end.entity.OrderStatusHistory>> getOrderHistory(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderHistory(id));
    }

    // --- Users Table Management ---
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<UserDTO> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserCreateDTO userCreateDTO) {
        return ResponseEntity.ok(userService.updateUser(id, userCreateDTO));
    }

    // --- Admins Table Management ---
    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminRepository.findAll());
    }

    @PostMapping("/admins")
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        if (admin.getRole() == null || admin.getRole().isEmpty()) {
            admin.setRole("ADMIN");
        }
        return ResponseEntity.ok(adminRepository.save(admin));
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        adminRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admins/{id}/toggle-role")
    public ResponseEntity<Admin> toggleAdminRole(@PathVariable Long id) {
        Admin admin = adminRepository.findById(id).orElseThrow();
        String newRole = "SUPER_ADMIN".equals(admin.getRole()) ? "ADMIN" : "SUPER_ADMIN";
        admin.setRole(newRole);
        return ResponseEntity.ok(adminRepository.save(admin));
    }

    // --- FR2.6 & FR2.7: Sales, Revenue & Low Stock Reports ---
    @GetMapping("/reports/sales")
    public ResponseEntity<Map<String, Object>> getSalesReports() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        long totalProducts = productRepository.count();
        List<Product> lowStockProducts = productRepository.findByStockLessThanEqual(5);

        double totalRevenue = orders.stream()
                .filter(o -> "SUCCESS".equalsIgnoreCase(o.getPaymentStatus()) || "DELIVERED".equalsIgnoreCase(o.getStatus()))
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                .sum();

        long totalOrders = orders.size();
        long pendingOrders = orders.stream().filter(o -> "PENDING".equalsIgnoreCase(o.getStatus()) || "PROCESSING".equalsIgnoreCase(o.getStatus())).count();
        long completedOrders = orders.stream().filter(o -> "DELIVERED".equalsIgnoreCase(o.getStatus())).count();

        Map<String, Object> report = new HashMap<>();
        report.put("totalRevenue", totalRevenue);
        report.put("totalOrders", totalOrders);
        report.put("pendingOrders", pendingOrders);
        report.put("completedOrders", completedOrders);
        report.put("totalProducts", totalProducts);
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
