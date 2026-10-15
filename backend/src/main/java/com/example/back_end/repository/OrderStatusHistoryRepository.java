package com.example.back_end.repository;

import com.example.back_end.entity.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {
    List<OrderStatusHistory> findByOrderIdOrderByCreatedAtAsc(Long orderId);
    List<OrderStatusHistory> findByOrderNumberOrderByCreatedAtAsc(String orderNumber);
}
