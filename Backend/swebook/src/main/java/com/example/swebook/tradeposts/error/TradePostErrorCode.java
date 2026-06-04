package com.example.swebook.tradeposts.error;

import com.example.swebook.global.error.ErrorCode;
import org.springframework.http.HttpStatus;

public enum TradePostErrorCode implements ErrorCode {
    TRADE_POST_NOT_FOUND(HttpStatus.NOT_FOUND, "TRADE_POST_404_001", "판매글을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    TradePostErrorCode(HttpStatus httpStatus, String code, String message) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }

    @Override
    public HttpStatus httpStatus() {
        return httpStatus;
    }

    @Override
    public String code() {
        return code;
    }

    @Override
    public String message() {
        return message;
    }
}
