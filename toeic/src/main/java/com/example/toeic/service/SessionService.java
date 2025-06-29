package com.example.toeic.service;

import com.example.toeic.entity.Session;
import com.example.toeic.entity.User;
import com.example.toeic.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionService {

    private final SessionRepository sessionRepository;

    public Session createSession(User user, int totalQuestions) {
        Session session = new Session();
        session.setUser(user);
        session.setTotalQuestions(totalQuestions);
        session.setStartedAt(LocalDateTime.now());
        return sessionRepository.save(session);
    }

    public Session finishSession(Long sessionId, int correctAnswers) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setFinishedAt(LocalDateTime.now());
        session.setCorrectAnswers(correctAnswers);
        return sessionRepository.save(session);
    }

    public Session findById(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    @Transactional(readOnly = true)
    public List<Session> getUserSessions(Long userId) {
        return sessionRepository.findByUserIdOrderByStartedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Session> getUserRecentSessions(Long userId, LocalDateTime since) {
        return sessionRepository.findByUserIdAndStartedAtAfter(userId, since);
    }

    @Transactional(readOnly = true)
    public Long getUserSessionCount(Long userId) {
        return sessionRepository.countByUserId(userId);
    }
} 