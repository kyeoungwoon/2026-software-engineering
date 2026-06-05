package com.example.swebook.books.controller;

import com.example.swebook.books.dto.BookRequest;
import com.example.swebook.books.dto.BookResponse;
import com.example.swebook.books.error.BookSuccessCode;
import com.example.swebook.books.service.BookService;
import com.example.swebook.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Books", description = "도서 등록 및 검색 API")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/search")
    @Operation(
            summary = "도서 키워드 검색",
            description = "제목, 저자, 출판사 기준으로 도서를 검색합니다. 판매글 등록 시 기존 도서를 연결할 때 사용합니다."
    )
    public ApiResponse<List<BookResponse>> searchBooks(
            @Parameter(description = "검색 키워드", example = "운영체제")
            @RequestParam(defaultValue = "") String keyword
    ) {
        return ApiResponse.success(
                bookService.searchBooks(keyword),
                BookSuccessCode.BOOKS_FOUND
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "도서 정보 등록",
            description = "새로운 도서 정보를 등록합니다. 판매글 등록 시 검색 결과가 없을 때 사용합니다."
    )
    public ApiResponse<BookResponse> createBook(
            @Valid @RequestBody BookRequest request
    ) {
        return ApiResponse.success(
                bookService.createBook(request),
                BookSuccessCode.BOOK_CREATED
        );
    }
}
