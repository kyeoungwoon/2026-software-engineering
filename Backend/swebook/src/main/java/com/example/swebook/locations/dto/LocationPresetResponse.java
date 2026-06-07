package com.example.swebook.locations.dto;

import com.example.swebook.locations.entity.LocationPreset;

import java.math.BigDecimal;

public record LocationPresetResponse(
        String id,
        String label,
        String description,
        BigDecimal latitude,
        BigDecimal longitude,
        String radiusLabel
) {
    public static LocationPresetResponse from(LocationPreset locationPreset) {
        return new LocationPresetResponse(
                locationPreset.getLocationId(),
                locationPreset.getLabel(),
                locationPreset.getDescription(),
                locationPreset.getLatitude(),
                locationPreset.getLongitude(),
                locationPreset.getRadiusLabel()
        );
    }
}
