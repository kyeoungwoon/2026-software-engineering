package com.example.swebook.tradeposts.repository;

import com.example.swebook.tradeposts.entity.TradeAvailableTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeAvailableTimeRepository extends JpaRepository<TradeAvailableTime, Long> {

    List<TradeAvailableTime> findByTradePostPostIdOrderByStartAtAsc(Long postId);
}
