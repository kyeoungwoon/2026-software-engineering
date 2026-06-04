package com.example.swebook.tradeposts.repository;

import com.example.swebook.traderequests.entity.TradeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface TradePostRequestLookupRepository extends JpaRepository<TradeRequest, Long> {

    List<TradeRequest> findByAvailableTimeAvailableTimeIdIn(Collection<Long> availableTimeIds);
}
