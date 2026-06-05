package com.example.swebook.books.error;

import com.example.swebook.global.response.ApiResponse;

public final class BookSuccessCode {

    public static final ApiResponse.SuccessCode BOOKS_FOUND =
            ApiResponse.SuccessCode.of("BOOKS_FOUND", "책 검색에 성공했습니다.");

    public static final ApiResponse.SuccessCode BOOK_CREATED =
            ApiResponse.SuccessCode.of("201 CREATED", "BOOK_CREATED", "책 정보가 등록되었습니다.");

    private BookSuccessCode() {
    }
}
