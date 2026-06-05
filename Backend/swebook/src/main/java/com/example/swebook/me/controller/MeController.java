package com.example.swebook.me.controller;

import com.example.swebook.global.response.ApiResponse;
import com.example.swebook.me.dto.MeTradeRequestResponse;
import com.example.swebook.me.error.MeSuccessCode;
import com.example.swebook.me.service.MeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Me", description = "내 구매 요청 및 판매 요청 목록 조회 API")
@RestController
@RequestMapping("/api/me")
public class MeController {

    private final MeService meService;

    public MeController(MeService meService) {
        this.meService = meService;
    }

    @GetMapping("/trade-requests/{userId}")
    @Operation(
            summary = "내 구매 요청 목록 조회",
            description = "구매자 입장에서 내가 보낸 구매 요청 목록을 최신순으로 조회합니다."
    )
    public ApiResponse<List<MeTradeRequestResponse>> getMyTradeRequests(
            @Parameter(description = "사용자 ID", example = "1")
            @PathVariable Long userId
    ) {
        return ApiResponse.success(
                meService.getMyTradeRequests(userId),
                MeSuccessCode.MY_TRADE_REQUESTS_FOUND
        );
    }

    @GetMapping("/sales/requests/{userId}")
    @Operation(
            summary = "판매자 요청 목록 조회",
            description = "판매자 입장에서 내 판매글에 들어온 구매 요청 목록을 최신순으로 조회합니다."
    )
    public ApiResponse<List<MeTradeRequestResponse>> getSalesRequests(
            @Parameter(description = "사용자 ID", example = "1")
            @PathVariable Long userId
    ) {
        return ApiResponse.success(
                meService.getSalesRequests(userId),
                MeSuccessCode.SALE_REQUESTS_FOUND
        );
    }
}
