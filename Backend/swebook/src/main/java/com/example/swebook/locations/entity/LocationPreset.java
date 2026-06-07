package com.example.swebook.locations.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "location_presets")
public class LocationPreset {

    @Id
    @Column(name = "location_id", length = 30)
    private String locationId;

    @Column(nullable = false, length = 50)
    private String label;

    @Column(nullable = false, length = 100)
    private String description;

    @Column(nullable = false)
    private BigDecimal latitude;

    @Column(nullable = false)
    private BigDecimal longitude;

    @Column(name = "radius_label", nullable = false, length = 30)
    private String radiusLabel;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    protected LocationPreset() {
    }

    public String getLocationId() {
        return locationId;
    }

    public String getLabel() {
        return label;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public String getRadiusLabel() {
        return radiusLabel;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }
}
