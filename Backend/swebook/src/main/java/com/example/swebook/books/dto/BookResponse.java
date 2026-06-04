package com.example.swebook.books.dto;

import com.example.swebook.books.entity.Book;

import java.time.LocalDateTime;

public record BookResponse(
        Long bookId,
        String title,
        String author,
        String publisher,
        String edition,
        String isbn,
        LocalDateTime createdAt
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getEdition(),
                book.getIsbn(),
                book.getCreatedAt()
        );
    }
}
