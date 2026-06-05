package com.example.swebook.traderequests.controller;

import com.example.swebook.global.response.ApiResponse;
import com.example.swebook.traderequests.dto.TradeRequestResponse;
import com.example.swebook.traderequests.error.TradeRequestSuccessCode;
import com.example.swebook.traderequests.service.TradeRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Trade Requests", description = "구매 요청 수락/거절 API")
@RestController
@RequestMapping("/api/trade-requests")
public class TradeRequestController {

    private final TradeRequestService tradeRequestService;

    public TradeRequestController(TradeRequestService tradeRequestService) {
        this.tradeRequestService = tradeRequestService;
    }

    @PatchMapping("/{requestId}/accept")
    @Operation(
            summary = "구매 요청 수락",
            description = "판매자가 구매 요청을 수락합니다. 요청이 ACCEPTED로, 게시글이 RESERVED로 변경되고 다른 PENDING 요청들은 자동으로 REJECTED됩니다."
    )
    public ApiResponse<TradeRequestResponse> acceptTradeRequest(
            @Parameter(description = "거래 요청 ID", example = "500")
            @PathVariable Long requestId
    ) {
        return ApiResponse.success(
                tradeRequestService.acceptTradeRequest(requestId),
                TradeRequestSuccessCode.TRADE_REQUEST_ACCEPTED
        );
    }

    @PatchMapping("/{requestId}/reject")
    @Operation(
            summary = "구매 요청 거절",
            description = "판매자가 구매 요청을 거절합니다. 요청이 REJECTED로 변경되고 게시글 상태는 유지됩니다."
    )
    public ApiResponse<TradeRequestResponse> rejectTradeRequest(
            @Parameter(description = "거래 요청 ID", example = "500")
            @PathVariable Long requestId
    ) {
        return ApiResponse.success(
                tradeRequestService.rejectTradeRequest(requestId),
                TradeRequestSuccessCode.TRADE_REQUEST_REJECTED
        );
    }
}
