package com.example.swebook.tradeposts.dto;

import com.example.swebook.tradeposts.entity.TradeAvailableTime;

import java.time.LocalDateTime;
import java.util.List;

public record AvailableTimeResponse(
        Long postId,
        List<AvailableTimeItem> availableTimes
) {
    public static AvailableTimeResponse of(Long postId, List<AvailableTimeItem> availableTimes) {
        return new AvailableTimeResponse(postId, availableTimes);
    }

    public record AvailableTimeItem(
            String id,
            LocalDateTime startAt,
            LocalDateTime endAt,
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
