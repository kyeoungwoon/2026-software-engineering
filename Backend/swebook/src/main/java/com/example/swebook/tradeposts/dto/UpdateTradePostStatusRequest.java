package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.TradePostStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "판매글 상태 변경 요청")
public record UpdateTradePostStatusRequest(
        @Schema(description = "변경할 판매글 상태", example = "RESERVED", allowableValues = {"AVAILABLE", "RESERVED", "SOLD"}, requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull TradePostStatus status
) {
}
