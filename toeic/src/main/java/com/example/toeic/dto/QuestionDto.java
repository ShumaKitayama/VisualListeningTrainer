package com.example.toeic.dto;

import java.util.List;

public class QuestionDto {
    private Long id;
    private String imagePath;
    private String explanation;
    private List<ChoiceDto> choices;

    // Constructors
    public QuestionDto() {}

    public QuestionDto(Long id, String imagePath, String explanation, List<ChoiceDto> choices) {
        this.id = id;
        this.imagePath = imagePath;
        this.explanation = explanation;
        this.choices = choices;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public List<ChoiceDto> getChoices() {
        return choices;
    }

    public void setChoices(List<ChoiceDto> choices) {
        this.choices = choices;
    }
} 