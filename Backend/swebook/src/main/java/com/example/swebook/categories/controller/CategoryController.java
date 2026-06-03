package com.example.swebook.categories.controller;

import com.example.swebook.categories.dto.CategoryResponse;
import com.example.swebook.categories.service.CategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/majors")
    public List<CategoryResponse> getMajors() {
        return categoryService.getMajors();
    }

    @GetMapping("/{majorCode}/courses")
    public List<CategoryResponse> getCourses(@PathVariable String majorCode) {
        return categoryService.getCourses(majorCode);
    }
}
