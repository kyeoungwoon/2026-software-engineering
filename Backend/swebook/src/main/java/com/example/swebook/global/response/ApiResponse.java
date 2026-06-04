package com.example.swebook.global.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;

public record ApiResponse<T>(
        boolean success,
        SuccessCode successCode,
        T data,
        Meta meta
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(
                true,
                SuccessCode.ok(),
                data,
                Meta.now()
        );
    }

    public record SuccessCode(
            String httpStatus,
            String code,
            String message
    ) {
        public static SuccessCode ok() {
            return new SuccessCode("200 OK", "SUCCESS", "요청이 성공했습니다.");
        }
    }

    public record Meta(
            @JsonProperty("time-stamp")
            OffsetDateTime timeStamp
    ) {
        public static Meta now() {
            return new Meta(OffsetDateTime.now());
        }
    }
}
