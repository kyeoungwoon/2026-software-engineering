package com.example.swebook.tradeposts.dto;

import com.example.swebook.me.entity.User;
import com.example.swebook.traderequests.entity.TradeRequest;
import com.example.swebook.traderequests.entity.TradeRequestStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "구매 요청 생성 응답")
public record CreateTradeRequestResponse(
        @Schema(description = "구매 요청 ID", example = "500")
        Long requestId,
        @Schema(description = "판매글 ID", example = "100")
        Long postId,
        @Schema(description = "구매자 정보")
        UserInfo buyer,
        @Schema(description = "판매자 정보")
        UserInfo seller,
        @Schema(description = "구매자가 요청한 거래 시간", example = "2026-05-29T13:00:00")
        LocalDateTime availableTime,
        @Schema(description = "구매 요청 상태", example = "PENDING")
        TradeRequestStatus requestStatus,
        @Schema(description = "요청 생성 시각", example = "2026-05-28T06:21:27")
        LocalDateTime createdAt
) {
    public static CreateTradeRequestResponse from(TradeRequest tradeRequest, LocalDateTime requestedAvailableTime) {
        return new CreateTradeRequestResponse(
                tradeRequest.getRequestId(),
                tradeRequest.getTradePost().getPostId(),
                UserInfo.from(tradeRequest.getUser()),
                UserInfo.from(tradeRequest.getTradePost().getSeller()),
                requestedAvailableTime,
                tradeRequest.getStatus(),
                tradeRequest.getCreatedAt()
        );
    }

    @Schema(description = "사용자 요약 정보")
    public record UserInfo(
            @Schema(description = "사용자 ID", example = "5")
            Long userId,
            @Schema(description = "사용자 닉네임", example = "서원")
            String nickname
    ) {
        public static UserInfo from(User user) {
            return new UserInfo(
                    user.getUserId(),
                    user.getNickname()
            );
        }
    }
}
