package com.example.toeic.repository;

import com.example.toeic.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    @Query(value = "SELECT * FROM questions ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Question> findRandomQuestions(@Param("limit") int limit);
    
    @Query("SELECT DISTINCT q FROM Question q JOIN FETCH q.choices")
    List<Question> findAllQuestionsWithChoices();
    
    default List<Question> findRandomQuestionsWithChoices(int limit) {
        List<Question> allQuestions = findAllQuestionsWithChoices();
        java.util.Collections.shuffle(allQuestions);
        return allQuestions.stream().limit(limit).collect(java.util.stream.Collectors.toList());
    }
} 