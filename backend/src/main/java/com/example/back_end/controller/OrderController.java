package com.example.back_end.controller;

import com.example.back_end.dto.OrderRequestDTO;
import com.example.back_end.entity.Order;
import com.example.back_end.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.MediaType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class OrderController {

    private final OrderService orderService;
    private final com.example.back_end.service.OrderStreamService orderStreamService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequestDTO request) {
        log.info("Received order request for: {}", request.getUserEmail());
        Order createdOrder = orderService.placeOrder(request);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@RequestParam String email) {
        return ResponseEntity.ok(orderService.getUserOrders(email));
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamOrders(@RequestParam(required = false) String email) {
        log.info("SSE real-time stream subscription for email: {}", email);
        return orderStreamService.subscribe(email);
    }
}
