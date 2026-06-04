package com.example.swebook.traderequests.service;

import com.example.swebook.traderequests.dto.TradeRequestResponse;
import com.example.swebook.traderequests.repository.TradeRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class TradeRequestService {

    private final TradeRequestRepository tradeRequestRepository;

    public TradeRequestService(TradeRequestRepository tradeRequestRepository) {
        this.tradeRequestRepository = tradeRequestRepository;
    }

    public TradeRequestResponse getTradeRequest(Long requestId) {
        return tradeRequestRepository.findWithDetailsByRequestId(requestId)
                .map(TradeRequestResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trade request not found"));
    }
}
