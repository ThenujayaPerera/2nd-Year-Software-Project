package com.example.back_end.repository;

import com.example.back_end.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'SUCCESS' OR o.status = 'DELIVERED'")
    Double calculateTotalRevenue();
}
