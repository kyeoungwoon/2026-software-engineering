package com.example.swebook.me.dto;

import com.example.swebook.traderequests.entity.TradeRequest;
import com.example.swebook.traderequests.entity.TradeRequestStatus;

import java.time.LocalDateTime;

public record MeTradeRequestResponse(
        Long requestId,
        Long buyerId,
        String buyerNickname,
        Long sellerId,
        String sellerNickname,
        Long postId,
        String bookTitle,
        Long availableTimeId,
        LocalDateTime startAt,
        LocalDateTime endAt,
        TradeRequestStatus status,
        LocalDateTime createdAt
) {
    public static MeTradeRequestResponse from(TradeRequest tradeRequest) {
        return new MeTradeRequestResponse(
                tradeRequest.getRequestId(),
                tradeRequest.getUser().getUserId(),
                tradeRequest.getUser().getNickname(),
                tradeRequest.getTradePost().getSeller().getUserId(),
                tradeRequest.getTradePost().getSeller().getNickname(),
                tradeRequest.getTradePost().getPostId(),
                tradeRequest.getTradePost().getBook().getTitle(),
                tradeRequest.getAvailableTime().getAvailableTimeId(),
                tradeRequest.getAvailableTime().getStartAt(),
                tradeRequest.getAvailableTime().getEndAt(),
                tradeRequest.getStatus(),
                tradeRequest.getCreatedAt()
        );
    }
}
