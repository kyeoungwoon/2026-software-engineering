package com.example.swebook.tradeposts.service;

import com.example.swebook.tradeposts.dto.TradePostResponse;
import com.example.swebook.global.error.BusinessException;
import com.example.swebook.tradeposts.error.TradePostErrorCode;
import com.example.swebook.tradeposts.repository.TradePostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TradePostService {

    private final TradePostRepository tradePostRepository;

    public TradePostService(TradePostRepository tradePostRepository) {
        this.tradePostRepository = tradePostRepository;
    }

    public List<TradePostResponse> getTradePosts() {
        return tradePostRepository.findByDeletedAtIsNullOrderByCreatedAtDesc()
                .stream()
                .map(TradePostResponse::from)
                .toList();
    }

    public TradePostResponse getTradePost(Long postId) {
        return tradePostRepository.findByPostIdAndDeletedAtIsNull(postId)
                .map(TradePostResponse::from)
                .orElseThrow(() -> new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND));
    }
}
