package com.example.swebook.tradeposts.service;

import com.example.swebook.global.error.BusinessException;
import com.example.swebook.tradeposts.dto.AvailableTimeResponse;
import com.example.swebook.tradeposts.dto.CompleteTradePostResponse;
import com.example.swebook.tradeposts.dto.CreateTradeRequestRequest;
import com.example.swebook.tradeposts.dto.CreateTradeRequestResponse;
import com.example.swebook.tradeposts.dto.TradePostDetailResponse;
import com.example.swebook.tradeposts.dto.TradePostResponse;
import com.example.swebook.me.entity.User;
import com.example.swebook.me.error.MeErrorCode;
import com.example.swebook.me.repository.UserRepository;
import com.example.swebook.tradeposts.error.TradePostErrorCode;
import com.example.swebook.tradeposts.entity.BookImage;
import com.example.swebook.tradeposts.entity.TradeAvailableTime;
import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.repository.BookImageRepository;
import com.example.swebook.tradeposts.repository.TradeAvailableTimeRepository;
import com.example.swebook.tradeposts.repository.TradePostRepository;
import com.example.swebook.tradeposts.repository.TradePostRequestLookupRepository;
import com.example.swebook.traderequests.entity.TradeRequest;
import com.example.swebook.traderequests.error.TradeRequestErrorCode;
import com.example.swebook.traderequests.repository.TradeRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TradePostService {

    private final TradePostRepository tradePostRepository;
    private final UserRepository userRepository;
    private final BookImageRepository bookImageRepository;
    private final TradeAvailableTimeRepository tradeAvailableTimeRepository;
    private final TradeRequestRepository tradeRequestRepository;
    private final TradePostRequestLookupRepository tradePostRequestLookupRepository;

    public TradePostService(
            TradePostRepository tradePostRepository,
            UserRepository userRepository,
            BookImageRepository bookImageRepository,
            TradeAvailableTimeRepository tradeAvailableTimeRepository,
            TradeRequestRepository tradeRequestRepository,
            TradePostRequestLookupRepository tradePostRequestLookupRepository
    ) {
        this.tradePostRepository = tradePostRepository;
        this.userRepository = userRepository;
        this.bookImageRepository = bookImageRepository;
        this.tradeAvailableTimeRepository = tradeAvailableTimeRepository;
        this.tradeRequestRepository = tradeRequestRepository;
        this.tradePostRequestLookupRepository = tradePostRequestLookupRepository;
    }

    public List<TradePostResponse> getTradePosts() {
        return tradePostRepository.findByDeletedAtIsNullOrderByCreatedAtDesc()
                .stream()
                .map(TradePostResponse::from)
                .toList();
    }

    public TradePostDetailResponse getTradePost(Long postId) {
        TradePost tradePost = tradePostRepository.findByPostIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND));
        List<BookImage> images = bookImageRepository.findByTradePostPostIdOrderBySortOrderAsc(postId);
        List<TradeAvailableTime> availableTimes = tradeAvailableTimeRepository.findByTradePostPostIdOrderByStartAtAsc(postId);

        return TradePostDetailResponse.from(tradePost, images, availableTimes);
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

    @Transactional
    public CreateTradeRequestResponse createTradeRequest(Long postId, CreateTradeRequestRequest request) {
        TradePost tradePost = tradePostRepository.findByPostIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND));
        User buyer = userRepository.findById(request.userId())
                .orElseThrow(() -> new BusinessException(MeErrorCode.USER_NOT_FOUND));

        if (tradePost.getSeller().getUserId().equals(buyer.getUserId())) {
            throw new BusinessException(TradeRequestErrorCode.SELLER_CANNOT_REQUEST_OWN_POST);
        }

        if (tradeRequestRepository.existsByUserUserIdAndTradePostPostId(buyer.getUserId(), postId)) {
            throw new BusinessException(TradeRequestErrorCode.DUPLICATE_TRADE_REQUEST);
        }

        TradeAvailableTime availableTime = tradeAvailableTimeRepository
                .findFirstByTradePostPostIdAndStartAtLessThanEqualAndEndAtGreaterThan(
                        postId,
                        request.availableTime(),
                        request.availableTime()
                )
                .orElseThrow(() -> new BusinessException(TradeRequestErrorCode.AVAILABLE_TIME_NOT_FOUND));
        TradeRequest tradeRequest = tradeRequestRepository.saveAndFlush(
                TradeRequest.create(buyer, tradePost, availableTime)
        );

        return CreateTradeRequestResponse.from(tradeRequest, request.availableTime());
    }

    @Transactional
    public CompleteTradePostResponse completeTradePost(Long postId) {
        TradePost tradePost = tradePostRepository.findByPostIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND));
        tradePost.complete();

        return CompleteTradePostResponse.from(tradePost);
    }
}
