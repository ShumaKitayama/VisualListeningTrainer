package com.example.toeic.repository;

import com.example.toeic.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    
    List<Result> findByUserIdOrderByAnsweredAtDesc(Long userId);
    
    List<Result> findBySessionId(Long sessionId);
    
    @Query("SELECT COUNT(r) FROM Result r WHERE r.user.id = :userId AND r.isCorrect = true")
    Long countCorrectAnswersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(r) FROM Result r WHERE r.user.id = :userId")
    Long countTotalAnswersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT r FROM Result r WHERE r.user.id = :userId AND r.answeredAt >= :startDate")
    List<Result> findByUserIdAndAnsweredAtAfter(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT CAST(r.answeredAt AS date) as date, " +
           "COUNT(r) as total, " +
           "SUM(CASE WHEN r.isCorrect = true THEN 1 ELSE 0 END) as correct " +
           "FROM Result r WHERE r.user.id = :userId " +
           "GROUP BY CAST(r.answeredAt AS date) " +
           "ORDER BY CAST(r.answeredAt AS date) DESC")
    List<Object[]> findDailyStatsByUserId(@Param("userId") Long userId);
}
