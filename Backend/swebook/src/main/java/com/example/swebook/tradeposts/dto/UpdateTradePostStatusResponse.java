package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.entity.TradePostStatus;

public record UpdateTradePostStatusResponse(
        Long postId,
        TradePostStatus status
) {
    public static UpdateTradePostStatusResponse from(TradePost tradePost) {
        return new UpdateTradePostStatusResponse(
                tradePost.getPostId(),
                tradePost.getStatus()
        );
    }
}
