package com.example.swebook.categories.repository;

import com.example.swebook.categories.entity.Category;
import com.example.swebook.categories.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, String> {

    List<Category> findByTypeOrderByCategoryCodeAsc(CategoryType type);

    List<Category> findByParentCategoryCodeAndTypeOrderByCategoryCodeAsc(String parentCode, CategoryType type);
}
