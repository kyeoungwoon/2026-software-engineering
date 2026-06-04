package com.example.swebook.tradeposts.dto;

import com.example.swebook.books.entity.Book;
import com.example.swebook.categories.entity.Category;
import com.example.swebook.me.entity.User;
import com.example.swebook.tradeposts.entity.BookImage;
import com.example.swebook.tradeposts.entity.TradeAvailableTime;
import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.entity.TradePostStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record TradePostDetailResponse(
        Long postId,
        SellerInfo seller,
        BookInfo book,
        CategoryInfo category,
        Integer price,
        String description,
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
    public static TradePostDetailResponse from(
            TradePost tradePost,
            List<BookImage> images,
            List<TradeAvailableTime> availableTimes
    ) {
        return new TradePostDetailResponse(
                tradePost.getPostId(),
                SellerInfo.from(tradePost.getSeller()),
                BookInfo.from(tradePost.getBook()),
                CategoryInfo.from(tradePost.getCategory()),
                tradePost.getPrice(),
                tradePost.getDescription(),
                tradePost.getStatus(),
                tradePost.getPlaceName(),
                null,
                tradePost.getLatitude(),
                tradePost.getLongitude(),
                images.stream()
                        .map(ImageInfo::from)
                        .toList(),
                availableTimes.stream()
                        .map(AvailableTimeInfo::from)
                        .toList(),
                tradePost.getCreatedAt(),
                tradePost.getUpdatedAt()
        );
    }

    public record SellerInfo(
            Long userId,
            String nickname
    ) {
        public static SellerInfo from(User seller) {
            return new SellerInfo(
                    seller.getUserId(),
                    seller.getNickname()
            );
        }
    }

    public record BookInfo(
            Long bookId,
            String title,
            String author,
            String publisher,
            String edition,
            String isbn
    ) {
        public static BookInfo from(Book book) {
            return new BookInfo(
                    book.getBookId(),
                    book.getTitle(),
                    book.getAuthor(),
                    book.getPublisher(),
                    book.getEdition(),
                    book.getIsbn()
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
        public static ImageInfo from(BookImage image) {
            return new ImageInfo(
                    image.getImageId(),
                    image.getImageUrl(),
                    Integer.valueOf(0).equals(image.getSortOrder())
            );
        }
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
