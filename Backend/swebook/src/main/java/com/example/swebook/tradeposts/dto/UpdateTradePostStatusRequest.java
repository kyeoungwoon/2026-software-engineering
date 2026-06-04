package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.TradePostStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTradePostStatusRequest(
        @NotNull TradePostStatus status
) {
}
