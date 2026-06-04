package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.entity.TradePostStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "판매글 상태 변경 응답")
public record UpdateTradePostStatusResponse(
        @Schema(description = "판매글 ID", example = "100")
        Long postId,
        @Schema(description = "변경된 판매글 상태", example = "RESERVED")
        TradePostStatus status
) {
    public static UpdateTradePostStatusResponse from(TradePost tradePost) {
        return new UpdateTradePostStatusResponse(
                tradePost.getPostId(),
                tradePost.getStatus()
        );
    }
}
