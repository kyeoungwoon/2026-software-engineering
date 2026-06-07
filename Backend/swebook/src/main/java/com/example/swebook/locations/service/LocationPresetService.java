package com.example.swebook.locations.service;

import com.example.swebook.locations.dto.LocationPresetResponse;
import com.example.swebook.locations.repository.LocationPresetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class LocationPresetService {

    private final LocationPresetRepository locationPresetRepository;

    public LocationPresetService(LocationPresetRepository locationPresetRepository) {
        this.locationPresetRepository = locationPresetRepository;
    }

    public List<LocationPresetResponse> getLocations() {
        return locationPresetRepository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(LocationPresetResponse::from)
                .toList();
    }
}
