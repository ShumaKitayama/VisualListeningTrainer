package com.example.toeic.dto;

import java.util.List;

public class StatsResponse {
    private Double overallAccuracy;      // 全期間平均正答率
    private Double recentAccuracy;       // 直近7日平均正答率
    private Integer totalQuestions;      // 総問題数
    private Integer correctAnswers;      // 総正解数
    private Integer totalSessions;       // 総セッション数
    private List<DailyStats> dailyStats; // 日別統計

    // Constructors
    public StatsResponse() {}

    public StatsResponse(Double overallAccuracy, Double recentAccuracy, Integer totalQuestions, 
                        Integer correctAnswers, Integer totalSessions, List<DailyStats> dailyStats) {
        this.overallAccuracy = overallAccuracy;
        this.recentAccuracy = recentAccuracy;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.totalSessions = totalSessions;
        this.dailyStats = dailyStats;
    }

    // Getters and Setters
    public Double getOverallAccuracy() {
        return overallAccuracy;
    }

    public void setOverallAccuracy(Double overallAccuracy) {
        this.overallAccuracy = overallAccuracy;
    }

    public Double getRecentAccuracy() {
        return recentAccuracy;
    }

    public void setRecentAccuracy(Double recentAccuracy) {
        this.recentAccuracy = recentAccuracy;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(Integer totalSessions) {
        this.totalSessions = totalSessions;
    }

    public List<DailyStats> getDailyStats() {
        return dailyStats;
    }

    public void setDailyStats(List<DailyStats> dailyStats) {
        this.dailyStats = dailyStats;
    }
} 