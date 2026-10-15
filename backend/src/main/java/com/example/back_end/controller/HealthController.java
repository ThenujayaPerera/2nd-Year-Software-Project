package com.example.back_end.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private static final long START_TIME = System.currentTimeMillis();

    @Autowired(required = false)
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("service", "NVSHOP.LK Cloud API");
        response.put("timestamp", Instant.now().toString());
        response.put("uptimeSeconds", (System.currentTimeMillis() - START_TIME) / 1000);

        // Database probe
        boolean dbConnected = false;
        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection()) {
                dbConnected = conn.isValid(2);
            } catch (Exception ignored) {
                dbConnected = false;
            }
        }
        response.put("database", dbConnected ? "CONNECTED" : "DEGRADED");

        Runtime runtime = Runtime.getRuntime();
        long freeMemoryMb = runtime.freeMemory() / (1024 * 1024);
        long totalMemoryMb = runtime.totalMemory() / (1024 * 1024);
        response.put("memoryFreeMb", freeMemoryMb);
        response.put("memoryTotalMb", totalMemoryMb);

        return ResponseEntity.ok(response);
    }
}
