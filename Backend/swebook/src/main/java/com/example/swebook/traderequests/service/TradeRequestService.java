package com.example.swebook.traderequests.service;

import com.example.swebook.traderequests.dto.TradeRequestResponse;
import com.example.swebook.global.error.BusinessException;
import com.example.swebook.traderequests.error.TradeRequestErrorCode;
import com.example.swebook.traderequests.repository.TradeRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .orElseThrow(() -> new BusinessException(TradeRequestErrorCode.TRADE_REQUEST_NOT_FOUND));
    }
}
