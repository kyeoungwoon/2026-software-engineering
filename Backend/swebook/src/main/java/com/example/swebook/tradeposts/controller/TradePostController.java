package com.example.swebook.tradeposts.controller;

import com.example.swebook.global.response.ApiResponse;
import com.example.swebook.tradeposts.dto.AvailableTimeResponse;
import com.example.swebook.tradeposts.dto.CreateTradeRequestRequest;
import com.example.swebook.tradeposts.dto.CreateTradeRequestResponse;
import com.example.swebook.tradeposts.dto.TradePostDetailResponse;
import com.example.swebook.tradeposts.dto.TradePostResponse;
import com.example.swebook.tradeposts.error.TradePostSuccessCode;
import com.example.swebook.tradeposts.service.TradePostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trade-posts")
public class TradePostController {

    private final TradePostService tradePostService;

    public TradePostController(TradePostService tradePostService) {
        this.tradePostService = tradePostService;
    }

    @GetMapping
    public List<TradePostResponse> getTradePosts() {
        return tradePostService.getTradePosts();
    }

    @GetMapping("/{postId}")
    public ApiResponse<TradePostDetailResponse> getTradePost(@PathVariable Long postId) {
        return ApiResponse.success(
                tradePostService.getTradePost(postId),
                TradePostSuccessCode.TRADE_POST_FOUND
        );
    }

    @GetMapping("/{postId}/available-times")
    public ApiResponse<AvailableTimeResponse> getAvailableTimes(@PathVariable Long postId) {
        return ApiResponse.success(
                tradePostService.getAvailableTimes(postId),
                TradePostSuccessCode.AVAILABLE_TIMES_FOUND
        );
    }

    @PostMapping("/{postId}/requests")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CreateTradeRequestResponse> createTradeRequest(
            @PathVariable Long postId,
            @Valid @RequestBody CreateTradeRequestRequest request
    ) {
        return ApiResponse.success(
                tradePostService.createTradeRequest(postId, request),
                TradePostSuccessCode.TRADE_REQUEST_CREATED
        );
    }
}
