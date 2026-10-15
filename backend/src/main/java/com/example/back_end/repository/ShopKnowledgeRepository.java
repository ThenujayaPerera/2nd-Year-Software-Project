package com.example.back_end.repository;

import com.example.back_end.entity.ShopKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopKnowledgeRepository extends JpaRepository<ShopKnowledge, Long> {

    List<ShopKnowledge> findByCategory(String category);

    @Query("SELECT sk FROM ShopKnowledge sk WHERE LOWER(sk.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(sk.content) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(sk.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<ShopKnowledge> searchByKeyword(@Param("query") String query);
}
