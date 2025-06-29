package com.example.toeic.repository;

import com.example.toeic.entity.Choice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, Long> {
    List<Choice> findByQuestionIdOrderByChoiceOrder(Long questionId);
    Choice findByQuestionIdAndIsCorrectTrue(Long questionId);
} 