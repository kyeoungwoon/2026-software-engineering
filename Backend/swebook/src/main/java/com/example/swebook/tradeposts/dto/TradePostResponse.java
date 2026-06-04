package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.entity.TradePostStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TradePostResponse(
        Long postId,
        Long sellerId,
        String sellerNickname,
        Long bookId,
        String bookTitle,
        String categoryCode,
        String categoryName,
        Integer price,
        String description,
        TradePostStatus status,
        String placeName,
        BigDecimal latitude,
        BigDecimal longitude,
        Integer radius,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TradePostResponse from(TradePost tradePost) {
        return new TradePostResponse(
                tradePost.getPostId(),
                tradePost.getSeller().getUserId(),
                tradePost.getSeller().getNickname(),
                tradePost.getBook().getBookId(),
                tradePost.getBook().getTitle(),
                tradePost.getCategory().getCategoryCode(),
                tradePost.getCategory().getName(),
                tradePost.getPrice(),
                tradePost.getDescription(),
                tradePost.getStatus(),
                tradePost.getPlaceName(),
                tradePost.getLatitude(),
                tradePost.getLongitude(),
                tradePost.getRadius(),
                tradePost.getCreatedAt(),
                tradePost.getUpdatedAt()
        );
    }
}
