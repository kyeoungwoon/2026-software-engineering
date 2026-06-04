package com.example.swebook.me.repository;

import com.example.swebook.traderequests.entity.TradeRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeTradeRequestRepository extends JpaRepository<TradeRequest, Long> {

    @EntityGraph(attributePaths = {"user", "tradePost", "tradePost.book", "tradePost.seller", "availableTime"})
    List<TradeRequest> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"user", "tradePost", "tradePost.book", "tradePost.seller", "availableTime"})
    List<TradeRequest> findByTradePostSellerUserIdOrderByCreatedAtDesc(Long sellerId);
}
