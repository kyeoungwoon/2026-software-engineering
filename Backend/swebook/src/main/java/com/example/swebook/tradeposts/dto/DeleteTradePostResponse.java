package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.TradePost;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "판매글 삭제 응답")
public record DeleteTradePostResponse(
        @Schema(description = "삭제된 판매글 ID", example = "100")
        Long postId,
        @Schema(description = "삭제 처리 시각", example = "2026-05-30T14:30:00")
        LocalDateTime deletedAt
) {
    public static DeleteTradePostResponse from(TradePost tradePost) {
        return new DeleteTradePostResponse(
                tradePost.getPostId(),
                tradePost.getDeletedAt()
        );
    }
}
