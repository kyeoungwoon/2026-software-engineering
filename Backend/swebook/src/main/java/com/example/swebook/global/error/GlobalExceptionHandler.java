package com.example.swebook.global.error;

import com.example.swebook.global.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException exception) {
        ErrorCode errorCode = exception.getErrorCode();

        return ResponseEntity
                .status(errorCode.httpStatus())
                .body(ApiResponse.error(errorCode));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValidException() {
        return handleErrorCode(CommonErrorCode.INVALID_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadableException() {
        return handleErrorCode(CommonErrorCode.INVALID_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpRequestMethodNotSupportedException() {
        return handleErrorCode(CommonErrorCode.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatusException(ResponseStatusException exception) {
        ErrorCode errorCode = new ErrorCode() {
            @Override
            public org.springframework.http.HttpStatus httpStatus() {
                return org.springframework.http.HttpStatus.valueOf(exception.getStatusCode().value());
            }

            @Override
            public String code() {
                return "COMMON_" + exception.getStatusCode().value();
            }

            @Override
            public String message() {
                String reason = exception.getReason();
                return reason == null ? CommonErrorCode.INVALID_REQUEST.message() : reason;
            }
        };

        return ResponseEntity
                .status(errorCode.httpStatus())
                .body(ApiResponse.error(errorCode));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException() {
        return handleErrorCode(CommonErrorCode.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<ApiResponse<Void>> handleErrorCode(ErrorCode errorCode) {
        return ResponseEntity
                .status(errorCode.httpStatus())
                .body(ApiResponse.error(errorCode));
    }
}
