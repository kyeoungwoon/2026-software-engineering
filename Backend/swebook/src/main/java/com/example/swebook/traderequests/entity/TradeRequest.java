package com.example.swebook.traderequests.entity;

import com.example.swebook.me.entity.User;
import com.example.swebook.tradeposts.entity.TradeAvailableTime;
import com.example.swebook.tradeposts.entity.TradePost;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "trade_requests")
public class TradeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private TradePost tradePost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "available_time_id", nullable = false)
    private TradeAvailableTime availableTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TradeRequestStatus status;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    protected TradeRequest() {
    }

    public static TradeRequest create(User user, TradePost tradePost, TradeAvailableTime availableTime) {
        TradeRequest tradeRequest = new TradeRequest();
        tradeRequest.user = user;
        tradeRequest.tradePost = tradePost;
        tradeRequest.availableTime = availableTime;
        tradeRequest.status = TradeRequestStatus.PENDING;
        tradeRequest.createdAt = LocalDateTime.now();
        return tradeRequest;
    }

    public void accept() {
        this.status = TradeRequestStatus.ACCEPTED;
    }

    public void reject() {
        this.status = TradeRequestStatus.REJECTED;
    }

    public Long getRequestId() {
        return requestId;
    }

    public User getUser() {
        return user;
    }

    public TradePost getTradePost() {
        return tradePost;
    }

    public TradeAvailableTime getAvailableTime() {
        return availableTime;
    }

    public TradeRequestStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
