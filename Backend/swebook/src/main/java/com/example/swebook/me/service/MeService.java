package com.example.swebook.me.service;

import com.example.swebook.me.dto.MeTradeRequestResponse;
import com.example.swebook.me.dto.UserResponse;
import com.example.swebook.global.error.BusinessException;
import com.example.swebook.me.error.MeErrorCode;
import com.example.swebook.me.repository.MeTradeRequestRepository;
import com.example.swebook.me.repository.UserRepository;
import com.example.swebook.tradeposts.dto.TradePostResponse;
import com.example.swebook.tradeposts.repository.TradePostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MeService {

    private final UserRepository userRepository;
    private final MeTradeRequestRepository meTradeRequestRepository;
    private final TradePostRepository tradePostRepository;

    public MeService(
            UserRepository userRepository,
            MeTradeRequestRepository meTradeRequestRepository,
            TradePostRepository tradePostRepository
    ) {
        this.userRepository = userRepository;
        this.meTradeRequestRepository = meTradeRequestRepository;
        this.tradePostRepository = tradePostRepository;
    }

    public UserResponse getMe(Long userId) {
        return userRepository.findById(userId)
                .map(UserResponse::from)
                .orElseThrow(() -> new BusinessException(MeErrorCode.USER_NOT_FOUND));
    }

    public List<MeTradeRequestResponse> getMyTradeRequests(Long userId) {
        validateUserExists(userId);

        return meTradeRequestRepository.findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(MeTradeRequestResponse::from)
                .toList();
    }

    public List<TradePostResponse> getMySales(Long userId) {
        validateUserExists(userId);

        return tradePostRepository.findBySellerUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(userId)
                .stream()
                .map(TradePostResponse::from)
                .toList();
    }

    public List<MeTradeRequestResponse> getSalesRequests(Long userId) {
        validateUserExists(userId);

        return meTradeRequestRepository.findByTradePostSellerUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(MeTradeRequestResponse::from)
                .toList();
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new BusinessException(MeErrorCode.USER_NOT_FOUND);
        }
    }
}
