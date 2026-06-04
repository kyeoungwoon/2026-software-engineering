package com.example.swebook.books.repository;

import com.example.swebook.books.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrPublisherContainingIgnoreCaseOrderByTitleAsc(
            String titleKeyword,
            String authorKeyword,
            String publisherKeyword
    );
}
