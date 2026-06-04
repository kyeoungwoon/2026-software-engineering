package com.example.swebook.tradeposts.dto;

import com.example.swebook.books.entity.Book;
import com.example.swebook.categories.entity.Category;
import com.example.swebook.me.entity.User;
import com.example.swebook.tradeposts.entity.BookImage;
import com.example.swebook.tradeposts.entity.TradeAvailableTime;
import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.entity.TradePostStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "판매글 상세 조회 응답")
public record TradePostDetailResponse(
        @Schema(description = "판매글 ID", example = "100")
        Long postId,
        @Schema(description = "판매자 정보")
        SellerInfo seller,
        @Schema(description = "도서 상세 정보")
        BookInfo book,
        @Schema(description = "카테고리 정보")
        CategoryInfo category,
        @Schema(description = "판매 가격", example = "18000")
        Integer price,
        @Schema(description = "판매글 설명", example = "운영체제 수업에서 사용한 책입니다. 필기 조금 있습니다.")
        String description,
        @Schema(description = "판매글 상태", example = "AVAILABLE")
        TradePostStatus status,
        @Schema(description = "거래 희망 장소명", example = "중앙대학교 310관 인근")
        String placeName,
        @Schema(description = "거래 위치 위도", example = "37.5043000")
        BigDecimal latitude,
        @Schema(description = "거래 위치 경도", example = "126.9563000")
        BigDecimal longitude,
        @Schema(description = "판매글 이미지 목록")
        List<ImageInfo> images,
        @Schema(description = "거래 가능 시간 목록")
        List<AvailableTimeInfo> availableTimes,
        @Schema(description = "판매글 생성 시각", example = "2026-05-28T06:21:27")
        LocalDateTime createdAt,
        @Schema(description = "판매글 수정 시각", example = "2026-05-28T06:21:27")
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

    @Schema(description = "판매자 정보")
    public record SellerInfo(
            @Schema(description = "판매자 ID", example = "1")
            Long userId,
            @Schema(description = "판매자 닉네임", example = "도현")
            String nickname
    ) {
        public static SellerInfo from(User seller) {
            return new SellerInfo(
                    seller.getUserId(),
                    seller.getNickname()
            );
        }
    }

    @Schema(description = "도서 상세 정보")
    public record BookInfo(
            @Schema(description = "도서 ID", example = "10")
            Long bookId,
            @Schema(description = "도서 제목", example = "운영체제와 정보기술의 원리")
            String title,
            @Schema(description = "저자", example = "반효경")
            String author,
            @Schema(description = "출판사", example = "이화여자대학교출판문화원")
            String publisher,
            @Schema(description = "판 정보", example = "개정판")
            String edition,
            @Schema(description = "ISBN", example = "9788973000000")
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

    @Schema(description = "카테고리 정보")
    public record CategoryInfo(
            @Schema(description = "카테고리 코드", example = "100101")
            String categoryCode,
            @Schema(description = "부모 카테고리 코드", example = "100000")
            String parentCode,
            @Schema(description = "카테고리 타입", example = "COURSE")
            String type,
            @Schema(description = "카테고리 이름", example = "운영체제")
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

    @Schema(description = "판매글 이미지 정보")
    public record ImageInfo(
            @Schema(description = "이미지 ID", example = "1")
            Long imageId,
            @Schema(description = "이미지 URL", example = "/uploads/trade-posts/100/os-book-1.jpg")
            String imageUrl,
            @Schema(description = "대표 이미지 여부", example = "true")
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

    @Schema(description = "거래 가능 시간 정보")
    public record AvailableTimeInfo(
            @Schema(description = "거래 가능 시간 ID", example = "time-1")
            String id,
            @Schema(description = "거래 가능 시작 시간", example = "2026-05-29T13:00:00")
            LocalDateTime startAt,
            @Schema(description = "거래 가능 종료 시간", example = "2026-05-29T15:00:00")
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
