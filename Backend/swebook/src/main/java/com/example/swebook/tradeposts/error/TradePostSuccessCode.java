package com.example.swebook.tradeposts.error;

import com.example.swebook.global.response.ApiResponse;

public final class TradePostSuccessCode {

    public static final ApiResponse.SuccessCode AVAILABLE_TIMES_FOUND =
            ApiResponse.SuccessCode.of("AVAILABLE_TIMES_FOUND", "거래 가능 시간 조회에 성공했습니다.");

    private TradePostSuccessCode() {
    }
}
