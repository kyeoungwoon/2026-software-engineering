package com.example.swebook.tradeposts.service;

import com.example.swebook.tradeposts.dto.AvailableTimeResponse;
import com.example.swebook.tradeposts.dto.TradePostResponse;
import com.example.swebook.global.error.BusinessException;
import com.example.swebook.tradeposts.error.TradePostErrorCode;
import com.example.swebook.tradeposts.entity.TradeAvailableTime;
import com.example.swebook.tradeposts.repository.TradeAvailableTimeRepository;
import com.example.swebook.tradeposts.repository.TradePostRepository;
import com.example.swebook.tradeposts.repository.TradePostRequestLookupRepository;
import com.example.swebook.traderequests.entity.TradeRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TradePostService {

    private final TradePostRepository tradePostRepository;
    private final TradeAvailableTimeRepository tradeAvailableTimeRepository;
    private final TradePostRequestLookupRepository tradePostRequestLookupRepository;

    public TradePostService(
            TradePostRepository tradePostRepository,
            TradeAvailableTimeRepository tradeAvailableTimeRepository,
            TradePostRequestLookupRepository tradePostRequestLookupRepository
    ) {
        this.tradePostRepository = tradePostRepository;
        this.tradeAvailableTimeRepository = tradeAvailableTimeRepository;
        this.tradePostRequestLookupRepository = tradePostRequestLookupRepository;
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

    public AvailableTimeResponse getAvailableTimes(Long postId) {
        if (!tradePostRepository.existsById(postId)) {
            throw new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND);
        }

        List<TradeAvailableTime> availableTimes = tradeAvailableTimeRepository.findByTradePostPostIdOrderByStartAtAsc(postId);
        List<Long> availableTimeIds = availableTimes.stream()
                .map(TradeAvailableTime::getAvailableTimeId)
                .toList();
        Set<Long> requestedAvailableTimeIds = tradePostRequestLookupRepository.findByAvailableTimeAvailableTimeIdIn(availableTimeIds)
                .stream()
                .map(TradeRequest::getAvailableTime)
                .map(TradeAvailableTime::getAvailableTimeId)
                .collect(Collectors.toSet());

        List<AvailableTimeResponse.AvailableTimeItem> items = availableTimes.stream()
                .map(availableTime -> AvailableTimeResponse.AvailableTimeItem.from(
                        availableTime,
                        requestedAvailableTimeIds.contains(availableTime.getAvailableTimeId())
                ))
                .toList();

        return AvailableTimeResponse.of(postId, items);
    }
}
