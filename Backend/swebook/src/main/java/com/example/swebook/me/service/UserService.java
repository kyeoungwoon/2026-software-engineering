package com.example.swebook.me.service;

import com.example.swebook.me.dto.UserResponse;
import com.example.swebook.me.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAllByOrderByUserIdAsc()
                .stream()
                .map(UserResponse::from)
                .toList();
    }
}
