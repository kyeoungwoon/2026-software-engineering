package com.example.swebook.tradeposts.dto;

import com.example.swebook.books.entity.Book;
import com.example.swebook.categories.entity.Category;
import com.example.swebook.tradeposts.entity.TradeAvailableTime;
import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.entity.TradePostStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CreateTradePostResponse(
        Long postId,
        Long sellerId,
        BookInfo book,
        CategoryInfo category,
        Integer price,
        TradePostStatus status,
        String placeName,
        String detailAddress,
        BigDecimal latitude,
        BigDecimal longitude,
        List<ImageInfo> images,
        List<AvailableTimeInfo> availableTimes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CreateTradePostResponse from(
            TradePost tradePost,
            String detailAddress,
            List<TradeAvailableTime> availableTimes
    ) {
        return new CreateTradePostResponse(
                tradePost.getPostId(),
                tradePost.getSeller().getUserId(),
                BookInfo.from(tradePost.getBook()),
                CategoryInfo.from(tradePost.getCategory()),
                tradePost.getPrice(),
                tradePost.getStatus(),
                tradePost.getPlaceName(),
                detailAddress,
                tradePost.getLatitude(),
                tradePost.getLongitude(),
                List.of(),
                availableTimes.stream()
                        .map(AvailableTimeInfo::from)
                        .toList(),
                tradePost.getCreatedAt(),
                tradePost.getUpdatedAt()
        );
    }

    public record BookInfo(
            Long bookId,
            String title,
            String author
    ) {
        public static BookInfo from(Book book) {
            return new BookInfo(
                    book.getBookId(),
                    book.getTitle(),
                    book.getAuthor()
            );
        }
    }

    public record CategoryInfo(
            String categoryCode,
            String parentCode,
            String type,
            String name
    ) {
        public static CategoryInfo from(Category category) {
            Category parent = category.getParent();

            return new CategoryInfo(
                    category.getCategoryCode(),
                    parent == null ? null : parent.getCategoryCode(),
                    category.getType().name(),
                    category.getName()
            );
        }
    }

    public record ImageInfo(
            Long imageId,
            String imageUrl,
            boolean isCover
    ) {
    }

    public record AvailableTimeInfo(
            String id,
            LocalDateTime startAt,
            LocalDateTime endAt
    ) {
        public static AvailableTimeInfo from(TradeAvailableTime availableTime) {
            return new AvailableTimeInfo(
                    String.valueOf(availableTime.getAvailableTimeId()),
                    availableTime.getStartAt(),
                    availableTime.getEndAt()
            );
        }
    }
}
