package com.example.swebook.categories.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @Column(name = "category_code", length = 6)
    private String categoryCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_code")
    private Category parent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType type;

    @Column(nullable = false, length = 50)
    private String name;

    protected Category() {
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public Category getParent() {
        return parent;
    }

    public CategoryType getType() {
        return type;
    }

    public String getName() {
        return name;
    }
}
