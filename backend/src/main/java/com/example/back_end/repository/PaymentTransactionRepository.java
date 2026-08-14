package com.example.back_end.repository;

import com.example.back_end.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<PaymentTransaction> findAllByOrderByCreatedAtDesc();
}
