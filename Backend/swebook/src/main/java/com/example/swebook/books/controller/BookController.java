package com.example.swebook.books.controller;

import com.example.swebook.books.dto.BookResponse;
import com.example.swebook.books.service.BookService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/search")
    public List<BookResponse> searchBooks(@RequestParam(defaultValue = "") String keyword) {
        return bookService.searchBooks(keyword);
    }
}
