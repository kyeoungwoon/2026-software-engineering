package com.example.swebook.tradeposts.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CreateTradePostRequest(
        @NotNull Long sellerId,
        @NotNull Long bookId,
        @NotBlank String categoryCode,
        @NotNull @PositiveOrZero Integer price,
        String description,
        @NotBlank String placeName,
        String detailAddress,
        @NotNull BigDecimal latitude,
        @NotNull BigDecimal longitude,
        @NotEmpty List<@Valid AvailableTimeRequest> availableTimes
) {
    public record AvailableTimeRequest(
            @NotNull LocalDateTime startAt,
            @NotNull LocalDateTime endAt
    ) {
    }
}
