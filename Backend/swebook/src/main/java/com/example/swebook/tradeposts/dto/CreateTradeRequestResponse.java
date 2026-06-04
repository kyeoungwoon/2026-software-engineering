package com.example.swebook.tradeposts.dto;

import com.example.swebook.me.entity.User;
import com.example.swebook.traderequests.entity.TradeRequest;
import com.example.swebook.traderequests.entity.TradeRequestStatus;

import java.time.LocalDateTime;

public record CreateTradeRequestResponse(
        Long requestId,
        Long postId,
        UserInfo buyer,
        UserInfo seller,
        LocalDateTime availableTime,
        TradeRequestStatus requestStatus,
        LocalDateTime createdAt
) {
    public static CreateTradeRequestResponse from(TradeRequest tradeRequest, LocalDateTime requestedAvailableTime) {
        return new CreateTradeRequestResponse(
                tradeRequest.getRequestId(),
                tradeRequest.getTradePost().getPostId(),
                UserInfo.from(tradeRequest.getUser()),
                UserInfo.from(tradeRequest.getTradePost().getSeller()),
                requestedAvailableTime,
                tradeRequest.getStatus(),
                tradeRequest.getCreatedAt()
        );
    }

    public record UserInfo(
            Long userId,
            String nickname
    ) {
        public static UserInfo from(User user) {
            return new UserInfo(
                    user.getUserId(),
                    user.getNickname()
            );
        }
    }
}
