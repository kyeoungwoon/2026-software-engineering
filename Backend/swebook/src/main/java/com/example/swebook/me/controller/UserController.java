package com.example.swebook.me.controller;

import com.example.swebook.global.response.ApiResponse;
import com.example.swebook.me.dto.UserResponse;
import com.example.swebook.me.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Users", description = "과제용 사용자 조회 API")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(
            summary = "사용자 목록 조회",
            description = "과제용 로그인 모달에서 사용할 시드 사용자 목록을 조회합니다."
    )
    public ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.success(userService.getUsers());
    }
}
