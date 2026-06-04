package com.example.swebook.tradeposts.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Schema(description = "구매 요청 생성 요청")
public record CreateTradeRequestRequest(
        @Schema(description = "구매 요청을 생성하는 사용자 ID", example = "5", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull Long userId,
        @Schema(description = "구매자가 선택한 거래 희망 시간. 판매글의 거래 가능 시간 범위 안에 포함되어야 합니다.", example = "2026-05-29T13:00:00", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull LocalDateTime availableTime
) {
}
