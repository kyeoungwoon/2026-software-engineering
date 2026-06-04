package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.TradeAvailableTime;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "판매글 거래 가능 시간 조회 응답")
public record AvailableTimeResponse(
        @Schema(description = "판매글 ID", example = "100")
        Long postId,
        @Schema(description = "거래 가능 시간 목록")
        List<AvailableTimeItem> availableTimes
) {
    public static AvailableTimeResponse of(Long postId, List<AvailableTimeItem> availableTimes) {
        return new AvailableTimeResponse(postId, availableTimes);
    }

    @Schema(description = "거래 가능 시간 항목")
    public record AvailableTimeItem(
            @Schema(description = "거래 가능 시간 ID", example = "1")
            String id,
            @Schema(description = "거래 가능 시작 시간", example = "2026-05-29T13:00:00")
            LocalDateTime startAt,
            @Schema(description = "거래 가능 종료 시간", example = "2026-05-29T15:00:00")
            LocalDateTime endAt,
            @Schema(description = "이미 구매 요청에 사용된 시간 여부", example = "false")
            boolean isRequested
    ) {
        public static AvailableTimeItem from(TradeAvailableTime availableTime, boolean isRequested) {
            return new AvailableTimeItem(
                    String.valueOf(availableTime.getAvailableTimeId()),
                    availableTime.getStartAt(),
                    availableTime.getEndAt(),
                    isRequested
            );
        }
    }
}
