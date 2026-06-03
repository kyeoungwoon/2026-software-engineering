package com.example.swebook.me.controller;

import com.example.swebook.me.dto.UserResponse;
import com.example.swebook.me.service.MeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
public class MeController {

    private final MeService meService;

    public MeController(MeService meService) {
        this.meService = meService;
    }

    @GetMapping("/{userId}")
    public UserResponse getMe(@PathVariable Long userId) {
        return meService.getMe(userId);
    }
}
