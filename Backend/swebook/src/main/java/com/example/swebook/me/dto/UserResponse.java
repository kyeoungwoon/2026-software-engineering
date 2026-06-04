package com.example.swebook.me.dto;

import com.example.swebook.me.entity.User;

import java.math.BigDecimal;

public record UserResponse(
        Long userId,
        String email,
        String nickname,
        BigDecimal latitude,
        BigDecimal longitude,
        Integer radius
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getNickname(),
                user.getLatitude(),
                user.getLongitude(),
                user.getRadius()
        );
    }
}
