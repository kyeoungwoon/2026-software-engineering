package com.example.swebook.global.error;

import org.springframework.http.HttpStatus;

public interface ErrorCode {

    HttpStatus httpStatus();

    String code();

    String message();
}
