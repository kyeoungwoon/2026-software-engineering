package com.example.swebook.books.service;

import com.example.swebook.books.dto.BookResponse;
import com.example.swebook.books.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<BookResponse> searchBooks(String keyword) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim();

        return bookRepository
                .findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrPublisherContainingIgnoreCaseOrderByTitleAsc(
                        normalizedKeyword,
                        normalizedKeyword,
                        normalizedKeyword
                )
                .stream()
                .map(BookResponse::from)
                .toList();
    }
}
