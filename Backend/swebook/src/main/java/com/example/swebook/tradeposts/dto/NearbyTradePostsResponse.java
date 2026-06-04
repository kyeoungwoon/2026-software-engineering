package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.BookImage;
import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.entity.TradePostStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "주변 판매글 검색 응답")
public record NearbyTradePostsResponse(
        @Schema(description = "거리순으로 정렬된 판매글 목록")
        List<PostItem> posts,
        @Schema(description = "페이지 정보")
        PageInfo page
) {
    public static NearbyTradePostsResponse of(List<PostItem> posts, PageInfo page) {
        return new NearbyTradePostsResponse(posts, page);
    }

    @Schema(description = "주변 판매글 항목")
    public record PostItem(
            @Schema(description = "판매글 ID", example = "100")
            Long postId,
            @Schema(description = "도서명", example = "운영체제와 정보기술의 원리")
            String bookName,
            @Schema(description = "카테고리명", example = "운영체제")
            String categoryName,
            @Schema(description = "판매자 정보")
            SellerInfo seller,
            @Schema(description = "판매 가격", example = "18000")
            Integer price,
            @Schema(description = "판매글 상태", example = "AVAILABLE")
            TradePostStatus status,
            @Schema(description = "요청 위치와 판매글 위치 사이의 거리(m)", example = "250")
            long distanceMeter,
            @Schema(description = "대표 이미지 URL", example = "/uploads/trade-posts/100/os-book-1.jpg")
            String coverImageUrl
    ) {
        public static PostItem from(TradePost tradePost, long distanceMeter, BookImage coverImage) {
            return new PostItem(
                    tradePost.getPostId(),
                    tradePost.getBook().getTitle(),
                    tradePost.getCategory().getName(),
                    SellerInfo.from(tradePost),
                    tradePost.getPrice(),
                    tradePost.getStatus(),
                    distanceMeter,
                    coverImage == null ? null : coverImage.getImageUrl()
            );
        }
    }

    @Schema(description = "판매자 요약 정보")
    public record SellerInfo(
            @Schema(description = "판매자 ID", example = "1")
            Long sellerId,
            @Schema(description = "판매자 닉네임", example = "도현")
            String sellerName
    ) {
        public static SellerInfo from(TradePost tradePost) {
            return new SellerInfo(
                    tradePost.getSeller().getUserId(),
                    tradePost.getSeller().getNickname()
            );
        }
    }

    @Schema(description = "페이지 정보")
    public record PageInfo(
            @Schema(description = "현재 페이지 번호", example = "0")
            int page,
            @Schema(description = "페이지 크기", example = "10")
            int size,
            @Schema(description = "전체 데이터 개수", example = "2")
            long totalElements,
            @Schema(description = "전체 페이지 수", example = "1")
            int totalPages,
            @Schema(description = "다음 페이지 존재 여부", example = "false")
            boolean hasNext
    ) {
        public static PageInfo of(int page, int size, long totalElements) {
            int totalPages = size == 0 ? 0 : (int) Math.ceil((double) totalElements / size);

            return new PageInfo(
                    page,
                    size,
                    totalElements,
                    totalPages,
                    page + 1 < totalPages
            );
        }
    }
}
