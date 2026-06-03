package com.example.swebook.me.service;

import com.example.swebook.me.dto.UserResponse;
import com.example.swebook.me.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class MeService {

    private final UserRepository userRepository;

    public MeService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getMe(Long userId) {
        return userRepository.findById(userId)
                .map(UserResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
