package com.example.swebook.global.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.example.swebook.global.error.ErrorCode;
import org.springframework.http.HttpStatus;

import java.time.OffsetDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        SuccessCode successCode,
        ErrorCodeResponse errorCode,
        T data,
        Meta meta
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(
                true,
                SuccessCode.ok(),
                null,
                data,
                Meta.now()
        );
    }

    public static ApiResponse<Void> error(ErrorCode errorCode) {
        return new ApiResponse<>(
                false,
                null,
                ErrorCodeResponse.from(errorCode),
                null,
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

    public record ErrorCodeResponse(
            String httpStatus,
            String code,
            String message
    ) {
        public static ErrorCodeResponse from(ErrorCode errorCode) {
            HttpStatus httpStatus = errorCode.httpStatus();

            return new ErrorCodeResponse(
                    httpStatus.value() + " " + httpStatus.getReasonPhrase(),
                    errorCode.code(),
                    errorCode.message()
            );
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
