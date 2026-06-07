package com.example.swebook.locations.repository;

import com.example.swebook.locations.entity.LocationPreset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationPresetRepository extends JpaRepository<LocationPreset, String> {

    List<LocationPreset> findAllByOrderBySortOrderAsc();
}
