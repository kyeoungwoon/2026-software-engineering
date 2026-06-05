package com.example.swebook.categories.controller;

import com.example.swebook.categories.dto.CategoryResponse;
import com.example.swebook.categories.error.CategorySuccessCode;
import com.example.swebook.categories.service.CategoryService;
import com.example.swebook.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Categories", description = "전공 및 과목 카테고리 조회 API")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/majors")
    @Operation(
            summary = "전공 카테고리 목록 조회",
            description = "전공 코드 기준으로 오름차순 정렬된 전공 목록을 조회합니다."
    )
    public ApiResponse<List<CategoryResponse>> getMajors() {
        return ApiResponse.success(
                categoryService.getMajors(),
                CategorySuccessCode.MAJOR_CATEGORIES_FOUND
        );
    }

    @GetMapping("/{majorCode}/courses")
    @Operation(
            summary = "특정 전공 과목 목록 조회",
            description = "과목 코드 기준으로 오름차순 정렬된 특정 전공의 과목 목록을 조회합니다."
    )
    public ApiResponse<List<CategoryResponse>> getCourses(
            @Parameter(description = "전공 카테고리 코드", example = "100000")
            @PathVariable String majorCode
    ) {
        return ApiResponse.success(
                categoryService.getCourses(majorCode),
                CategorySuccessCode.COURSE_CATEGORIES_FOUND
        );
    }
}
