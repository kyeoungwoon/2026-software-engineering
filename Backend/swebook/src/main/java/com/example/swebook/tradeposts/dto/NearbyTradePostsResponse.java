package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.BookImage;
import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.entity.TradePostStatus;

import java.util.List;

public record NearbyTradePostsResponse(
        List<PostItem> posts,
        PageInfo page
) {
    public static NearbyTradePostsResponse of(List<PostItem> posts, PageInfo page) {
        return new NearbyTradePostsResponse(posts, page);
    }

    public record PostItem(
            Long postId,
            String bookName,
            String categoryName,
            SellerInfo seller,
            Integer price,
            TradePostStatus status,
            long distanceMeter,
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

    public record SellerInfo(
            Long sellerId,
            String sellerName
    ) {
        public static SellerInfo from(TradePost tradePost) {
            return new SellerInfo(
                    tradePost.getSeller().getUserId(),
                    tradePost.getSeller().getNickname()
            );
        }
    }

    public record PageInfo(
            int page,
            int size,
            long totalElements,
            int totalPages,
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
