package com.example.swebook.traderequests.error;

import com.example.swebook.global.response.ApiResponse;

public final class TradeRequestSuccessCode {

    public static final ApiResponse.SuccessCode TRADE_REQUEST_ACCEPTED =
            ApiResponse.SuccessCode.of("TRADE_REQUEST_ACCEPTED", "구매 요청을 수락했습니다.");

    public static final ApiResponse.SuccessCode TRADE_REQUEST_REJECTED =
            ApiResponse.SuccessCode.of("TRADE_REQUEST_REJECTED", "구매 요청을 거절했습니다.");

    private TradeRequestSuccessCode() {
    }
}
