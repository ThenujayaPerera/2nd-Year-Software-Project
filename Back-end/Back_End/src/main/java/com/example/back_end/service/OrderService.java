package com.example.back_end.service;

import com.example.back_end.dto.OrderRequestDTO;
import com.example.back_end.entity.Order;
import com.example.back_end.entity.OrderItem;
import com.example.back_end.entity.PaymentTransaction;
import com.example.back_end.entity.Product;
import com.example.back_end.repository.OrderItemRepository;
import com.example.back_end.repository.OrderRepository;
import com.example.back_end.repository.PaymentTransactionRepository;
import com.example.back_end.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final MailService mailService;

    @Transactional
    public Order placeOrder(OrderRequestDTO request) {
        log.info("Processing order placement for user: {}", request.getUserEmail());

        Order order = new Order();
        String orderNum = "NV-" + System.currentTimeMillis() % 1000000;
        order.setOrderNumber(orderNum);
        order.setUserEmail(request.getUserEmail());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setCity(request.getCity());
        order.setPostalCode(request.getPostalCode());
        order.setSubtotal(request.getSubtotal());
        order.setTax(request.getTax());
        order.setShippingCost(request.getShippingCost());
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus("PROCESSING");
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD");
        order.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "PENDING");

        List<OrderItem> items = new ArrayList<>();
        if (request.getItems() != null) {
            for (OrderRequestDTO.OrderItemDTO dto : request.getItems()) {
                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProductId(dto.getProductId());
                item.setProductName(dto.getProductName());
                item.setProductImage(dto.getProductImage());
                item.setPrice(dto.getPrice());
                item.setQuantity(dto.getQuantity());
                item.setSubtotal(dto.getSubtotal());
                items.add(item);

                // FR2.5: Automatically update inventory / deduct stock quantities
                if (dto.getProductId() != null) {
                    productRepository.findById(dto.getProductId()).ifPresent(prod -> {
                        int remainingStock = Math.max(0, (prod.getStock() != null ? prod.getStock() : 0) - dto.getQuantity());
                        prod.setStock(remainingStock);
                        productRepository.save(prod);
                        log.info("Deducted stock for product {}. Remaining stock: {}", prod.getName(), remainingStock);
                    });
                }
            }
        }
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);

        // FR3.3: Record payment transaction
        PaymentTransaction txn = new PaymentTransaction();
        txn.setTransactionReference(request.getTransactionReference() != null ? request.getTransactionReference() : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        txn.setOrderNumber(savedOrder.getOrderNumber());
        txn.setUserEmail(savedOrder.getUserEmail());
        txn.setAmount(savedOrder.getTotalAmount());
        txn.setCurrency("LKR");
        txn.setPaymentGateway(savedOrder.getPaymentMethod());
        txn.setStatus("SUCCESS".equalsIgnoreCase(savedOrder.getPaymentStatus()) ? "SUCCESS" : "PENDING");
        paymentTransactionRepository.save(txn);

        // FR1.7: Send instant Order Confirmation Email to customer
        try {
            mailService.sendOrderConfirmationEmail(savedOrder);
        } catch (Exception e) {
            log.warn("Failed to dispatch confirmation email: {}", e.getMessage());
        }

        return savedOrder;
    }

    public List<Order> getUserOrders(String userEmail) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(status.toUpperCase());
        return orderRepository.save(order);
    }
}
