package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.BookImage;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "판매글 이미지 업로드 응답")
public record UploadTradePostImagesResponse(
        @Schema(description = "판매글 ID", example = "100")
        Long postId,
        @Schema(description = "업로드된 이미지 목록")
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

    @Schema(description = "판매글 이미지 정보")
    public record ImageInfo(
            @Schema(description = "이미지 ID", example = "1")
            Long imageId,
            @Schema(description = "로컬 업로드 이미지 접근 경로", example = "/uploads/trade-posts/100/image-1.jpg")
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
}
