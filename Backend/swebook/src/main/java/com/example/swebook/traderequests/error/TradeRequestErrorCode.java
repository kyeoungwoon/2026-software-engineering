package com.example.swebook.traderequests.error;

import com.example.swebook.global.error.ErrorCode;
import org.springframework.http.HttpStatus;

public enum TradeRequestErrorCode implements ErrorCode {
    TRADE_REQUEST_NOT_FOUND(HttpStatus.NOT_FOUND, "TRADE_REQUEST_404_001", "거래 요청을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    TradeRequestErrorCode(HttpStatus httpStatus, String code, String message) {
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
