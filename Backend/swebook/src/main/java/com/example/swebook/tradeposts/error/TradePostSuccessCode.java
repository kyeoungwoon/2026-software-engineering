package com.example.swebook.tradeposts.error;

import com.example.swebook.global.response.ApiResponse;

public final class TradePostSuccessCode {

    public static final ApiResponse.SuccessCode TRADE_POST_FOUND =
            ApiResponse.SuccessCode.of("TRADE_POST_FOUND", "판매글 상세 조회에 성공했습니다.");

    public static final ApiResponse.SuccessCode AVAILABLE_TIMES_FOUND =
            ApiResponse.SuccessCode.of("AVAILABLE_TIMES_FOUND", "거래 가능 시간 조회에 성공했습니다.");

    public static final ApiResponse.SuccessCode TRADE_REQUEST_CREATED =
            ApiResponse.SuccessCode.of("201 CREATED", "TRADE_REQUEST_CREATED", "구매 요청이 생성되었습니다.");

    public static final ApiResponse.SuccessCode TRADE_POST_STATUS_UPDATED =
            ApiResponse.SuccessCode.of("TRADE_POST_STATUS_UPDATED", "판매글 상태가 변경되었습니다.");

    private TradePostSuccessCode() {
    }
}
