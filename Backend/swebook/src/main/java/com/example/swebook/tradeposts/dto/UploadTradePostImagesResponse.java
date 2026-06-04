package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.BookImage;

import java.util.List;

public record UploadTradePostImagesResponse(
        Long postId,
        List<ImageInfo> images
) {
    public static UploadTradePostImagesResponse of(Long postId, List<BookImage> images) {
        return new UploadTradePostImagesResponse(
                postId,
                images.stream()
                        .map(ImageInfo::from)
                        .toList()
        );
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
}
