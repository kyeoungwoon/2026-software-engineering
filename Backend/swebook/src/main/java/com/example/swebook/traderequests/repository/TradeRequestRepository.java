package com.example.swebook.traderequests.repository;

import com.example.swebook.traderequests.entity.TradeRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TradeRequestRepository extends JpaRepository<TradeRequest, Long> {

    @EntityGraph(attributePaths = {"user", "tradePost", "tradePost.book", "tradePost.seller", "availableTime"})
    Optional<TradeRequest> findWithDetailsByRequestId(Long requestId);

    boolean existsByUserUserIdAndTradePostPostId(Long userId, Long postId);
}
