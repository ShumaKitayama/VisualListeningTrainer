package com.example.toeic.dto;

import java.time.LocalDate;

public class DailyStats {
    private LocalDate date;
    private Double accuracy;
    private Integer questionsAnswered;

    // Constructors
    public DailyStats() {}

    public DailyStats(LocalDate date, Double accuracy, Integer questionsAnswered) {
        this.date = date;
        this.accuracy = accuracy;
        this.questionsAnswered = questionsAnswered;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public Integer getQuestionsAnswered() {
        return questionsAnswered;
    }

    public void setQuestionsAnswered(Integer questionsAnswered) {
        this.questionsAnswered = questionsAnswered;
    }
} 