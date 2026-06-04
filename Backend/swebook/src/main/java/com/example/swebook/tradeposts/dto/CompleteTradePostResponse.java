package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.entity.TradePostStatus;

public record CompleteTradePostResponse(
        Long postId,
        TradePostStatus status
) {
    public static CompleteTradePostResponse from(TradePost tradePost) {
        return new CompleteTradePostResponse(
                tradePost.getPostId(),
                tradePost.getStatus()
        );
    }
}
