package com.example.back_end.service;

import com.example.back_end.entity.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OrderStreamService {

    // Emitters mapped by normalized user email; null/empty email stored in GLOBAL key
    private final Map<String, Set<SseEmitter>> emailEmitters = new ConcurrentHashMap<>();
    private final Set<SseEmitter> broadcastEmitters = ConcurrentHashMap.newKeySet();

    private static final Long SSE_TIMEOUT = 30 * 60 * 1000L; // 30 minutes

    public SseEmitter subscribe(String email) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        String key = (email != null && !email.isBlank()) ? email.trim().toLowerCase() : "GLOBAL";

        emailEmitters.computeIfAbsent(key, k -> ConcurrentHashMap.newKeySet()).add(emitter);
        broadcastEmitters.add(emitter);

        emitter.onCompletion(() -> removeEmitter(key, emitter));
        emitter.onTimeout(() -> removeEmitter(key, emitter));
        emitter.onError(e -> removeEmitter(key, emitter));

        // Send initial connection handshake event
        try {
            emitter.send(SseEmitter.event()
                    .name("CONNECTED")
                    .data(Map.of("message", "Real-time order tracking connected", "timestamp", System.currentTimeMillis())));
        } catch (IOException e) {
            removeEmitter(key, emitter);
        }

        log.info("Client subscribed to real-time order stream for user: {}", key);
        return emitter;
    }

    public void broadcastOrderUpdate(Order order) {
        if (order == null) return;

        Map<String, Object> payload = Map.of(
                "orderId", order.getId(),
                "orderNumber", order.getOrderNumber() != null ? order.getOrderNumber() : "",
                "userEmail", order.getUserEmail() != null ? order.getUserEmail() : "",
                "status", order.getStatus() != null ? order.getStatus() : "",
                "timestamp", System.currentTimeMillis()
        );

        String userKey = order.getUserEmail() != null ? order.getUserEmail().trim().toLowerCase() : "";

        // Notify specific user listeners
        if (!userKey.isBlank() && emailEmitters.containsKey(userKey)) {
            for (SseEmitter emitter : emailEmitters.get(userKey)) {
                sendEvent(emitter, "ORDER_STATUS_UPDATE", payload);
            }
        }

        // Notify global/admin listeners
        if (emailEmitters.containsKey("GLOBAL")) {
            for (SseEmitter emitter : emailEmitters.get("GLOBAL")) {
                sendEvent(emitter, "ORDER_STATUS_UPDATE", payload);
            }
        }
    }

    private void sendEvent(SseEmitter emitter, String eventName, Object data) {
        try {
            emitter.send(SseEmitter.event().name(eventName).data(data));
        } catch (Exception e) {
            emitter.complete();
        }
    }

    private void removeEmitter(String key, SseEmitter emitter) {
        if (key != null && emailEmitters.containsKey(key)) {
            emailEmitters.get(key).remove(emitter);
            if (emailEmitters.get(key).isEmpty()) {
                emailEmitters.remove(key);
            }
        }
        broadcastEmitters.remove(emitter);
    }
}
