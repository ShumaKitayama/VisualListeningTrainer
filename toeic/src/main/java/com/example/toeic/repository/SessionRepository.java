package com.example.toeic.repository;

import com.example.toeic.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    
    List<Session> findByUserIdOrderByStartedAtDesc(Long userId);
    
    @Query("SELECT s FROM Session s WHERE s.user.id = :userId AND s.startedAt >= :startDate")
    List<Session> findByUserIdAndStartedAtAfter(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(s) FROM Session s WHERE s.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
} 