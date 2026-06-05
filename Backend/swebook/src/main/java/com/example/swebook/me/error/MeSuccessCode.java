package com.example.swebook.me.error;

import com.example.swebook.global.response.ApiResponse;

public final class MeSuccessCode {

    public static final ApiResponse.SuccessCode MY_TRADE_REQUESTS_FOUND =
            ApiResponse.SuccessCode.of("MY_TRADE_REQUESTS_FOUND", "내 구매 요청 목록 조회에 성공했습니다.");

    public static final ApiResponse.SuccessCode SALE_REQUESTS_FOUND =
            ApiResponse.SuccessCode.of("SALE_REQUESTS_FOUND", "판매 요청 목록 조회에 성공했습니다.");

    private MeSuccessCode() {
    }
}
