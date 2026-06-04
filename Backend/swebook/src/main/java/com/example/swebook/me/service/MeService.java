package com.example.swebook.me.service;

import com.example.swebook.me.dto.MeTradeRequestResponse;
import com.example.swebook.me.dto.UserResponse;
import com.example.swebook.global.error.BusinessException;
import com.example.swebook.me.error.MeErrorCode;
import com.example.swebook.me.repository.MeTradeRequestRepository;
import com.example.swebook.me.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MeService {

    private final UserRepository userRepository;
    private final MeTradeRequestRepository meTradeRequestRepository;

    public MeService(UserRepository userRepository, MeTradeRequestRepository meTradeRequestRepository) {
        this.userRepository = userRepository;
        this.meTradeRequestRepository = meTradeRequestRepository;
    }

    public UserResponse getMe(Long userId) {
        return userRepository.findById(userId)
                .map(UserResponse::from)
                .orElseThrow(() -> new BusinessException(MeErrorCode.USER_NOT_FOUND));
    }

    public List<MeTradeRequestResponse> getMyTradeRequests(Long userId) {
        return meTradeRequestRepository.findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(MeTradeRequestResponse::from)
                .toList();
    }

    public List<MeTradeRequestResponse> getSalesRequests(Long userId) {
        return meTradeRequestRepository.findByTradePostSellerUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(MeTradeRequestResponse::from)
                .toList();
    }
}
