package com.example.swebook.traderequests.error;

import com.example.swebook.global.error.ErrorCode;
import org.springframework.http.HttpStatus;

public enum TradeRequestErrorCode implements ErrorCode {
    TRADE_REQUEST_NOT_FOUND(HttpStatus.NOT_FOUND, "TRADE_REQUEST_404_001", "거래 요청을 찾을 수 없습니다."),
    AVAILABLE_TIME_NOT_FOUND(HttpStatus.NOT_FOUND, "TRADE_REQUEST_404_002", "거래 가능 시간을 찾을 수 없습니다."),
    DUPLICATE_TRADE_REQUEST(HttpStatus.CONFLICT, "TRADE_REQUEST_409_001", "이미 해당 판매글에 구매 요청을 생성했습니다."),
    SELLER_CANNOT_REQUEST_OWN_POST(HttpStatus.BAD_REQUEST, "TRADE_REQUEST_400_001", "판매자는 본인 판매글에 구매 요청을 생성할 수 없습니다.");

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
