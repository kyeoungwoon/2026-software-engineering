package com.example.swebook.tradeposts.repository;

import com.example.swebook.tradeposts.entity.BookImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookImageRepository extends JpaRepository<BookImage, Long> {

    List<BookImage> findByTradePostPostIdOrderBySortOrderAsc(Long postId);
}
