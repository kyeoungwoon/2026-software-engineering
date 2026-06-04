package com.example.swebook.tradeposts.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateTradeRequestRequest(
        @NotNull Long userId,
        @NotNull LocalDateTime availableTime
) {
}
