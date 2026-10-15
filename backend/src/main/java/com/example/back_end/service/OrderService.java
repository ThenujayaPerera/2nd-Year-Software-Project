package com.example.back_end.service;

import com.example.back_end.dto.OrderRequestDTO;
import com.example.back_end.entity.Order;
import com.example.back_end.entity.OrderItem;
import com.example.back_end.entity.PaymentTransaction;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.OrderStatusHistory;
import com.example.back_end.repository.OrderItemRepository;
import com.example.back_end.repository.OrderRepository;
import com.example.back_end.repository.OrderStatusHistoryRepository;
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
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final MailService mailService;
    private final OrderStreamService orderStreamService;

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
        // Initial state is PENDING until admin reviews & confirms it as PLACED
        order.setStatus("PENDING");
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
                item.setWarrantyPeriod(dto.getWarrantyPeriod());
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

        // Record initial status history event
        OrderStatusHistory initialHistory = new OrderStatusHistory(
                order,
                orderNum,
                "PENDING",
                "Order received from customer via NVSHOP.LK storefront. Awaiting store confirmation.",
                "CUSTOMER"
        );
        order.getStatusHistory().add(initialHistory);

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

        // Live broadcast order placement to real-time streams
        try {
            orderStreamService.broadcastOrderUpdate(savedOrder);
        } catch (Exception e) {
            log.warn("Failed to broadcast order update: {}", e.getMessage());
        }

        return savedOrder;
    }

    public List<Order> getUserOrders(String userEmail) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<OrderStatusHistory> getOrderHistory(Long orderId) {
        return orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(orderId);
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        return updateOrderStatus(id, status, null, "ADMIN");
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status, String notes, String updatedBy) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        String upperStatus = status != null ? status.toUpperCase() : "PENDING";
        order.setStatus(upperStatus);

        String defaultNotes = switch (upperStatus) {
            case "PLACED" -> "Order confirmed and placed by NVSHOP Operations Admin.";
            case "PROCESSING" -> "Order is packed, inspected, and ready for courier pickup.";
            case "SHIPPED" -> "Dispatched with courier service for island-wide delivery.";
            case "DELIVERED" -> "Order successfully delivered to customer destination.";
            case "CANCELLED" -> "Order was cancelled.";
            default -> "Order status transitioned to " + upperStatus;
        };
        String finalNotes = (notes != null && !notes.isBlank()) ? notes : defaultNotes;
        String finalUpdatedBy = (updatedBy != null && !updatedBy.isBlank()) ? updatedBy : "ADMIN";

        OrderStatusHistory history = new OrderStatusHistory(
                order,
                order.getOrderNumber(),
                upperStatus,
                finalNotes,
                finalUpdatedBy
        );
        order.getStatusHistory().add(history);
        Order updated = orderRepository.save(order);

        // Dispatch status update notification email to customer
        try {
            mailService.sendOrderStatusUpdateEmail(updated);
        } catch (Exception e) {
            log.warn("Failed to dispatch order status update email: {}", e.getMessage());
        }

        // Live broadcast order status change to real-time customer tracking
        try {
            orderStreamService.broadcastOrderUpdate(updated);
        } catch (Exception e) {
            log.warn("Failed to broadcast order status update: {}", e.getMessage());
        }

        return updated;
    }
}
