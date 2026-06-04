package com.example.swebook.tradeposts.controller;

import com.example.swebook.tradeposts.dto.TradePostResponse;
import com.example.swebook.tradeposts.service.TradePostService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public TradePostResponse getTradePost(@PathVariable Long postId) {
        return tradePostService.getTradePost(postId);
    }
}
