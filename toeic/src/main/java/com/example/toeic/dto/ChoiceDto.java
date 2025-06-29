package com.example.toeic.dto;

public class ChoiceDto {
    private Long id;
    private String sentence;
    private Integer choiceOrder;
    // 正解情報は回答時まで含めない

    // Constructors
    public ChoiceDto() {}

    public ChoiceDto(Long id, String sentence, Integer choiceOrder) {
        this.id = id;
        this.sentence = sentence;
        this.choiceOrder = choiceOrder;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSentence() {
        return sentence;
    }

    public void setSentence(String sentence) {
        this.sentence = sentence;
    }

    public Integer getChoiceOrder() {
        return choiceOrder;
    }

    public void setChoiceOrder(Integer choiceOrder) {
        this.choiceOrder = choiceOrder;
    }
} 