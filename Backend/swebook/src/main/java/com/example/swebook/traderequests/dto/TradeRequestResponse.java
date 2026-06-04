package com.example.swebook.traderequests.dto;

import com.example.swebook.traderequests.entity.TradeRequest;
import com.example.swebook.traderequests.entity.TradeRequestStatus;

import java.time.LocalDateTime;

public record TradeRequestResponse(
        Long requestId,
        Long buyerId,
        String buyerNickname,
        Long postId,
        String bookTitle,
        Long sellerId,
        String sellerNickname,
        Long availableTimeId,
        LocalDateTime startAt,
        LocalDateTime endAt,
        TradeRequestStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TradeRequestResponse from(TradeRequest tradeRequest) {
        return new TradeRequestResponse(
                tradeRequest.getRequestId(),
                tradeRequest.getUser().getUserId(),
                tradeRequest.getUser().getNickname(),
                tradeRequest.getTradePost().getPostId(),
                tradeRequest.getTradePost().getBook().getTitle(),
                tradeRequest.getTradePost().getSeller().getUserId(),
                tradeRequest.getTradePost().getSeller().getNickname(),
                tradeRequest.getAvailableTime().getAvailableTimeId(),
                tradeRequest.getAvailableTime().getStartAt(),
                tradeRequest.getAvailableTime().getEndAt(),
                tradeRequest.getStatus(),
                tradeRequest.getCreatedAt(),
                tradeRequest.getUpdatedAt()
        );
    }
}
