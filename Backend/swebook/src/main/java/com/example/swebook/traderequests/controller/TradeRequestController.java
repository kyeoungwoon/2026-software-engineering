package com.example.swebook.traderequests.controller;

import com.example.swebook.traderequests.dto.TradeRequestResponse;
import com.example.swebook.traderequests.service.TradeRequestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trade-requests")
public class TradeRequestController {

    private final TradeRequestService tradeRequestService;

    public TradeRequestController(TradeRequestService tradeRequestService) {
        this.tradeRequestService = tradeRequestService;
    }

    @GetMapping("/{requestId}")
    public TradeRequestResponse getTradeRequest(@PathVariable Long requestId) {
        return tradeRequestService.getTradeRequest(requestId);
    }
}
