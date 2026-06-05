package com.example.swebook.books.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookRequest(
        @NotBlank(message = "책 제목은 필수입니다.")
        @Size(max = 150)
        String title,

        @Size(max = 100)
        String author,

        @Size(max = 100)
        String publisher,

        @Size(max = 50)
        String edition,

        @Size(max = 30)
        String isbn
) {
}
