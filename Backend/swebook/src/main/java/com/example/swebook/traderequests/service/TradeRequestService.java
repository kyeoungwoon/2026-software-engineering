package com.example.swebook.traderequests.service;

import com.example.swebook.global.error.BusinessException;
import com.example.swebook.traderequests.dto.TradeRequestResponse;
import com.example.swebook.traderequests.entity.TradeRequest;
import com.example.swebook.traderequests.entity.TradeRequestStatus;
import com.example.swebook.traderequests.error.TradeRequestErrorCode;
import com.example.swebook.traderequests.repository.TradeRequestRepository;
import com.example.swebook.tradeposts.entity.TradePost;
import com.example.swebook.tradeposts.entity.TradePostStatus;
import com.example.swebook.tradeposts.repository.TradePostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TradeRequestService {

    private final TradeRequestRepository tradeRequestRepository;
    private final TradePostRepository tradePostRepository;

    public TradeRequestService(TradeRequestRepository tradeRequestRepository,
                               TradePostRepository tradePostRepository) {
        this.tradeRequestRepository = tradeRequestRepository;
        this.tradePostRepository = tradePostRepository;
    }

    public TradeRequestResponse getTradeRequest(Long requestId) {
        return tradeRequestRepository.findWithDetailsByRequestId(requestId)
                .map(TradeRequestResponse::from)
                .orElseThrow(() -> new BusinessException(TradeRequestErrorCode.TRADE_REQUEST_NOT_FOUND));
    }

    @Transactional
    public TradeRequestResponse acceptTradeRequest(Long requestId) {
        TradeRequest tradeRequest = tradeRequestRepository.findWithDetailsByRequestId(requestId)
                .orElseThrow(() -> new BusinessException(TradeRequestErrorCode.TRADE_REQUEST_NOT_FOUND));

        // 이미 처리된 요청인지 확인
        if (tradeRequest.getStatus() != TradeRequestStatus.PENDING) {
            throw new BusinessException(TradeRequestErrorCode.TRADE_REQUEST_ALREADY_PROCESSED);
        }

        // 게시글 상태가 AVAILABLE인지 확인
        TradePost tradePost = tradeRequest.getTradePost();
        if (tradePost.getStatus() != TradePostStatus.AVAILABLE) {
            throw new BusinessException(TradeRequestErrorCode.TRADE_POST_NOT_AVAILABLE);
        }

        // 요청 수락
        tradeRequest.accept();

        // 게시글 RESERVED로 변경
        tradePost.updateStatus(TradePostStatus.RESERVED);

        // 같은 게시글의 다른 PENDING 요청들 전부 REJECTED
        List<TradeRequest> otherRequests = tradeRequestRepository
                .findByTradePostPostIdAndStatus(tradePost.getPostId(), TradeRequestStatus.PENDING);
        otherRequests.forEach(TradeRequest::reject);

        return TradeRequestResponse.from(tradeRequest);
    }

    @Transactional
    public TradeRequestResponse rejectTradeRequest(Long requestId) {
        TradeRequest tradeRequest = tradeRequestRepository.findWithDetailsByRequestId(requestId)
                .orElseThrow(() -> new BusinessException(TradeRequestErrorCode.TRADE_REQUEST_NOT_FOUND));

        // 이미 처리된 요청인지 확인
        if (tradeRequest.getStatus() != TradeRequestStatus.PENDING) {
            throw new BusinessException(TradeRequestErrorCode.TRADE_REQUEST_ALREADY_PROCESSED);
        }

        tradeRequest.reject();

        return TradeRequestResponse.from(tradeRequest);
    }
}
