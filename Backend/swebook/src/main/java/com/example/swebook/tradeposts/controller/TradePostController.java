package com.example.swebook.tradeposts.controller;

import com.example.swebook.global.response.ApiResponse;
import com.example.swebook.tradeposts.dto.AvailableTimeResponse;
import com.example.swebook.tradeposts.dto.CreateTradePostRequest;
import com.example.swebook.tradeposts.dto.CreateTradePostResponse;
import com.example.swebook.tradeposts.dto.CreateTradeRequestRequest;
import com.example.swebook.tradeposts.dto.CreateTradeRequestResponse;
import com.example.swebook.tradeposts.dto.DeleteTradePostResponse;
import com.example.swebook.tradeposts.dto.NearbyTradePostsResponse;
import com.example.swebook.tradeposts.dto.TradePostDetailResponse;
import com.example.swebook.tradeposts.dto.TradePostResponse;
import com.example.swebook.tradeposts.dto.UpdateTradePostStatusRequest;
import com.example.swebook.tradeposts.dto.UpdateTradePostStatusResponse;
import com.example.swebook.tradeposts.dto.UploadTradePostImagesResponse;
import com.example.swebook.tradeposts.error.TradePostSuccessCode;
import com.example.swebook.tradeposts.service.TradePostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CreateTradePostResponse> createTradePost(
            @Valid @RequestBody CreateTradePostRequest request
    ) {
        return ApiResponse.success(
                tradePostService.createTradePost(request),
                TradePostSuccessCode.TRADE_POST_CREATED
        );
    }

    @GetMapping("/search")
    public ApiResponse<NearbyTradePostsResponse> getNearbyTradePosts(
            @RequestParam BigDecimal latitude,
            @RequestParam BigDecimal longitude,
            @RequestParam String categoryCode,
            @RequestParam(required = false) String bookTitle,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(
                tradePostService.getNearbyTradePosts(latitude, longitude, categoryCode, bookTitle, page, size),
                TradePostSuccessCode.NEARBY_TRADE_POSTS_FOUND
        );
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

    @PostMapping(value = "/{postId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UploadTradePostImagesResponse> uploadTradePostImages(
            @PathVariable Long postId,
            @RequestPart("images") List<MultipartFile> images
    ) {
        return ApiResponse.success(
                tradePostService.uploadTradePostImages(postId, images),
                TradePostSuccessCode.TRADE_POST_IMAGES_UPLOADED
        );
    }

    @PatchMapping("/{postId}/status")
    public ApiResponse<UpdateTradePostStatusResponse> updateTradePostStatus(
            @PathVariable Long postId,
            @Valid @RequestBody UpdateTradePostStatusRequest request
    ) {
        return ApiResponse.success(
                tradePostService.updateTradePostStatus(postId, request),
                TradePostSuccessCode.TRADE_POST_STATUS_UPDATED
        );
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<DeleteTradePostResponse> deleteTradePost(@PathVariable Long postId) {
        return ApiResponse.success(
                tradePostService.deleteTradePost(postId),
                TradePostSuccessCode.TRADE_POST_DELETED
        );
    }
}
