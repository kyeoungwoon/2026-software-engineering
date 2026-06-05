package com.example.swebook.categories.error;

import com.example.swebook.global.response.ApiResponse;

public final class CategorySuccessCode {

    public static final ApiResponse.SuccessCode MAJOR_CATEGORIES_FOUND =
            ApiResponse.SuccessCode.of("MAJOR_CATEGORIES_FOUND", "전공 카테고리 조회에 성공했습니다.");

    public static final ApiResponse.SuccessCode COURSE_CATEGORIES_FOUND =
            ApiResponse.SuccessCode.of("COURSE_CATEGORIES_FOUND", "전공 하위 과목 조회에 성공했습니다.");

    private CategorySuccessCode() {
    }
}
