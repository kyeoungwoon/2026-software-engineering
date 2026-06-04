package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.TradePost;

import java.time.LocalDateTime;

public record DeleteTradePostResponse(
        Long postId,
        LocalDateTime deletedAt
) {
    public static DeleteTradePostResponse from(TradePost tradePost) {
        return new DeleteTradePostResponse(
                tradePost.getPostId(),
                tradePost.getDeletedAt()
        );
    }
}
