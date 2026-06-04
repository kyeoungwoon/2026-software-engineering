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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "Trade Posts", description = "판매글 등록, 조회, 이미지 업로드, 상태 변경, 삭제 API")
@RestController
@RequestMapping("/api/trade-posts")
public class TradePostController {

    private final TradePostService tradePostService;

    public TradePostController(TradePostService tradePostService) {
        this.tradePostService = tradePostService;
    }

    @GetMapping
    @Operation(
            summary = "판매글 목록 조회",
            description = "삭제되지 않은 판매글 목록을 생성일 기준 내림차순으로 조회합니다."
    )
    public List<TradePostResponse> getTradePosts() {
        return tradePostService.getTradePosts();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "판매글 등록",
            description = "판매자, 도서, 카테고리, 가격, 위치, 거래 가능 시간을 저장합니다. 이미지는 별도 이미지 업로드 API로 등록합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "판매글 등록 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "판매자, 도서 또는 카테고리를 찾을 수 없음")
    })
    public ApiResponse<CreateTradePostResponse> createTradePost(
            @Valid @RequestBody CreateTradePostRequest request
    ) {
        return ApiResponse.success(
                tradePostService.createTradePost(request),
                TradePostSuccessCode.TRADE_POST_CREATED
        );
    }

    @GetMapping("/search")
    @Operation(
            summary = "주변 판매글 검색",
            description = "사용자 현재 위치와 categoryCode를 기준으로 판매글을 조회하고, 각 판매글과 사용자 위치 사이의 거리를 계산해 가까운 순서로 반환합니다. bookTitle은 현재 입력만 받고 필터에는 적용하지 않습니다."
    )
    public ApiResponse<NearbyTradePostsResponse> getNearbyTradePosts(
            @Parameter(description = "현재 사용자 위도", example = "37.5043000")
            @RequestParam BigDecimal latitude,
            @Parameter(description = "현재 사용자 경도", example = "126.9563000")
            @RequestParam BigDecimal longitude,
            @Parameter(description = "조회할 카테고리 코드", example = "100101")
            @RequestParam String categoryCode,
            @Parameter(description = "책 제목 검색어. 현재는 입력만 받고 필터에는 적용하지 않습니다.", example = "운영체제")
            @RequestParam(required = false) String bookTitle,
            @Parameter(description = "페이지 번호", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(
                tradePostService.getNearbyTradePosts(latitude, longitude, categoryCode, bookTitle, page, size),
                TradePostSuccessCode.NEARBY_TRADE_POSTS_FOUND
        );
    }

    @GetMapping("/{postId}")
    @Operation(
            summary = "판매글 상세 조회",
            description = "판매글의 판매자, 도서, 카테고리, 이미지, 거래 가능 시간 정보를 조회합니다."
    )
    public ApiResponse<TradePostDetailResponse> getTradePost(
            @Parameter(description = "판매글 ID", example = "100")
            @PathVariable Long postId
    ) {
        return ApiResponse.success(
                tradePostService.getTradePost(postId),
                TradePostSuccessCode.TRADE_POST_FOUND
        );
    }

    @GetMapping("/{postId}/available-times")
    @Operation(
            summary = "거래 가능 시간 조회",
            description = "판매글의 거래 가능 시간 목록과 각 시간이 이미 요청되었는지 여부를 조회합니다."
    )
    public ApiResponse<AvailableTimeResponse> getAvailableTimes(
            @Parameter(description = "판매글 ID", example = "100")
            @PathVariable Long postId
    ) {
        return ApiResponse.success(
                tradePostService.getAvailableTimes(postId),
                TradePostSuccessCode.AVAILABLE_TIMES_FOUND
        );
    }

    @PostMapping("/{postId}/requests")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "판매글 구매 요청 생성",
            description = "사용자가 판매글에 구매 요청을 생성합니다. 요청 시간이 판매글의 거래 가능 시간 범위에 포함되어야 합니다."
    )
    public ApiResponse<CreateTradeRequestResponse> createTradeRequest(
            @Parameter(description = "판매글 ID", example = "100")
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
    @Operation(
            summary = "판매글 이미지 업로드",
            description = "이미 생성된 판매글에 이미지를 업로드합니다. multipart/form-data의 images 필드로 여러 파일을 전송합니다. 파일은 로컬 uploads 디렉터리에 저장되고 DB에는 /uploads/... 경로가 저장됩니다."
    )
    public ApiResponse<UploadTradePostImagesResponse> uploadTradePostImages(
            @Parameter(description = "판매글 ID", example = "100")
            @PathVariable Long postId,
            @Parameter(
                    name = "images",
                    description = "업로드할 이미지 파일 목록",
                    required = true,
                    in = ParameterIn.DEFAULT,
                    content = @Content(array = @ArraySchema(schema = @Schema(type = "string", format = "binary")))
            )
            @RequestPart("images") List<MultipartFile> images
    ) {
        return ApiResponse.success(
                tradePostService.uploadTradePostImages(postId, images),
                TradePostSuccessCode.TRADE_POST_IMAGES_UPLOADED
        );
    }

    @PatchMapping("/{postId}/status")
    @Operation(
            summary = "판매글 상태 변경",
            description = "판매글 상태를 AVAILABLE, RESERVED, SOLD 중 하나로 변경합니다."
    )
    public ApiResponse<UpdateTradePostStatusResponse> updateTradePostStatus(
            @Parameter(description = "판매글 ID", example = "100")
            @PathVariable Long postId,
            @Valid @RequestBody UpdateTradePostStatusRequest request
    ) {
        return ApiResponse.success(
                tradePostService.updateTradePostStatus(postId, request),
                TradePostSuccessCode.TRADE_POST_STATUS_UPDATED
        );
    }

    @DeleteMapping("/{postId}")
    @Operation(
            summary = "판매글 삭제",
            description = "판매글을 soft delete 처리합니다. deletedAt을 저장하며, 삭제 후 일반 상세 조회에서는 404로 응답합니다."
    )
    public ApiResponse<DeleteTradePostResponse> deleteTradePost(
            @Parameter(description = "판매글 ID", example = "100")
            @PathVariable Long postId
    ) {
        return ApiResponse.success(
                tradePostService.deleteTradePost(postId),
                TradePostSuccessCode.TRADE_POST_DELETED
        );
    }
}
