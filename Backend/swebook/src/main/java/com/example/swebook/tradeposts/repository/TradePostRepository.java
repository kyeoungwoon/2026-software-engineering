package com.example.swebook.tradeposts.repository;

import com.example.swebook.tradeposts.entity.TradePost;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TradePostRepository extends JpaRepository<TradePost, Long> {

    @EntityGraph(attributePaths = {"seller", "book", "category"})
    List<TradePost> findByDeletedAtIsNullOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"seller", "book", "category"})
    Optional<TradePost> findByPostIdAndDeletedAtIsNull(Long postId);
}
