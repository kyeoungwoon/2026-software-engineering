package com.example.swebook.categories.dto;

import com.example.swebook.categories.entity.Category;
import com.example.swebook.categories.entity.CategoryType;

public record CategoryResponse(
        String categoryCode,
        String parentCode,
        CategoryType type,
        String name
) {
    public static CategoryResponse from(Category category) {
        String parentCode = category.getParent() == null ? null : category.getParent().getCategoryCode();

        return new CategoryResponse(
                category.getCategoryCode(),
                parentCode,
                category.getType(),
                category.getName()
        );
    }
}
