package com.example.toeic.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "choices")
public class Choice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String sentence;
    
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;
    
    @Column(name = "choice_order", nullable = false)
    private Integer choiceOrder; // 選択肢の順序 (0-3)

    // Constructors
    public Choice() {}

    public Choice(Long id, Question question, String sentence, Boolean isCorrect, Integer choiceOrder) {
        this.id = id;
        this.question = question;
        this.sentence = sentence;
        this.isCorrect = isCorrect;
        this.choiceOrder = choiceOrder;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getSentence() {
        return sentence;
    }

    public void setSentence(String sentence) {
        this.sentence = sentence;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Integer getChoiceOrder() {
        return choiceOrder;
    }

    public void setChoiceOrder(Integer choiceOrder) {
        this.choiceOrder = choiceOrder;
    }
} 