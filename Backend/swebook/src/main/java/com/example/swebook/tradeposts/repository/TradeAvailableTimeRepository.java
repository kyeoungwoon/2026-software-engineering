package com.example.swebook.tradeposts.repository;

import com.example.swebook.tradeposts.entity.TradeAvailableTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TradeAvailableTimeRepository extends JpaRepository<TradeAvailableTime, Long> {

    List<TradeAvailableTime> findByTradePostPostIdOrderByStartAtAsc(Long postId);

    Optional<TradeAvailableTime> findFirstByTradePostPostIdAndStartAtLessThanEqualAndEndAtGreaterThan(
            Long postId,
            LocalDateTime requestedTime,
            LocalDateTime requestedTimeForEnd
    );
}
