package com.example.toeic.dto;

import jakarta.validation.constraints.NotNull;

public class AnswerRequest {
    
    @NotNull(message = "Session ID is required")
    private Long sessionId;
    
    @NotNull(message = "Question ID is required") 
    private Long questionId;
    
    @NotNull(message = "Choice ID is required")
    private Long choiceId;

    // Constructors
    public AnswerRequest() {}

    public AnswerRequest(Long sessionId, Long questionId, Long choiceId) {
        this.sessionId = sessionId;
        this.questionId = questionId;
        this.choiceId = choiceId;
    }

    // Getters and Setters
    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getChoiceId() {
        return choiceId;
    }

    public void setChoiceId(Long choiceId) {
        this.choiceId = choiceId;
    }
} 