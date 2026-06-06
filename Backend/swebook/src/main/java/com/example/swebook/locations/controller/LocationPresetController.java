package com.example.swebook.locations.controller;

import com.example.swebook.global.response.ApiResponse;
import com.example.swebook.locations.dto.LocationPresetResponse;
import com.example.swebook.locations.service.LocationPresetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Locations", description = "동네 프리셋 조회 API")
@RestController
@RequestMapping("/api/locations")
public class LocationPresetController {

    private final LocationPresetService locationPresetService;

    public LocationPresetController(LocationPresetService locationPresetService) {
        this.locationPresetService = locationPresetService;
    }

    @GetMapping
    @Operation(
            summary = "동네 프리셋 목록 조회",
            description = "메인 화면 동네 선택 바텀시트에서 사용할 위치 프리셋을 조회합니다."
    )
    public ApiResponse<List<LocationPresetResponse>> getLocations() {
        return ApiResponse.success(locationPresetService.getLocations());
    }
}
