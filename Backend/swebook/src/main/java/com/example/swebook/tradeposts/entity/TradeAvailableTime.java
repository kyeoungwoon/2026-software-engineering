package com.example.swebook.tradeposts.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "trade_available_time")
public class TradeAvailableTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "available_time_id")
    private Long availableTimeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private TradePost tradePost;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt;

    protected TradeAvailableTime() {
    }

    public static TradeAvailableTime create(TradePost tradePost, LocalDateTime startAt, LocalDateTime endAt) {
        TradeAvailableTime tradeAvailableTime = new TradeAvailableTime();
        tradeAvailableTime.tradePost = tradePost;
        tradeAvailableTime.startAt = startAt;
        tradeAvailableTime.endAt = endAt;
        return tradeAvailableTime;
    }

    public Long getAvailableTimeId() {
        return availableTimeId;
    }

    public TradePost getTradePost() {
        return tradePost;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }
}
