package com.example.swebook.tradeposts.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "판매글 등록 요청")
public record CreateTradePostRequest(
        @Schema(description = "판매자 ID", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull Long sellerId,
        @Schema(description = "판매할 도서 ID", example = "10", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull Long bookId,
        @Schema(description = "전공 또는 과목 카테고리 코드", example = "100101", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank String categoryCode,
        @Schema(description = "판매 가격", example = "18000", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull @PositiveOrZero Integer price,
        @Schema(description = "판매글 설명", example = "운영체제 수업에서 사용한 책입니다. 필기 조금 있습니다.")
        String description,
        @Schema(description = "거래 희망 장소명", example = "중앙대학교 310관 인근", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank String placeName,
        @Schema(description = "현재 DB에는 별도 컬럼이 없어 응답 호환용으로만 받는 값입니다.", example = "정문 근처")
        String detailAddress,
        @Schema(description = "거래 위치 위도", example = "37.5043000", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull BigDecimal latitude,
        @Schema(description = "거래 위치 경도", example = "126.9563000", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull BigDecimal longitude,
        @Schema(description = "거래 가능 시간 목록", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotEmpty List<@Valid AvailableTimeRequest> availableTimes
) {
    @Schema(description = "판매글 등록 시 함께 저장할 거래 가능 시간")
    public record AvailableTimeRequest(
            @Schema(description = "거래 가능 시작 시간", example = "2026-05-29T13:00:00", requiredMode = Schema.RequiredMode.REQUIRED)
            @NotNull LocalDateTime startAt,
            @Schema(description = "거래 가능 종료 시간", example = "2026-05-29T15:00:00", requiredMode = Schema.RequiredMode.REQUIRED)
            @NotNull LocalDateTime endAt
    ) {
    }
}
