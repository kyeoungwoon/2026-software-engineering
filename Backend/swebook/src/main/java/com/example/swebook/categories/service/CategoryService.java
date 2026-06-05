package com.example.swebook.categories.service;

import com.example.swebook.categories.dto.CategoryResponse;
import com.example.swebook.categories.entity.CategoryType;
import com.example.swebook.categories.error.CategoryErrorCode;
import com.example.swebook.categories.repository.CategoryRepository;
import com.example.swebook.global.error.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getMajors() {
        return categoryRepository.findByTypeOrderByCategoryCodeAsc(CategoryType.MAJOR)
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    public List<CategoryResponse> getCourses(String majorCode) {
        categoryRepository.findById(majorCode)
                .orElseThrow(() -> new BusinessException(CategoryErrorCode.CATEGORY_NOT_FOUND));

        return categoryRepository.findByParentCategoryCodeAndTypeOrderByCategoryCodeAsc(majorCode, CategoryType.COURSE)
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }
}
