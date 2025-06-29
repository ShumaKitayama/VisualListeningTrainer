package com.example.toeic.controller;

import com.example.toeic.dto.QuestionDto;
import com.example.toeic.entity.User;
import com.example.toeic.entity.Session;
import com.example.toeic.service.QuestionService;
import com.example.toeic.service.SessionService;
import com.example.toeic.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;
    private final SessionService sessionService;
    private final UserService userService;

    @GetMapping("/random")
    public ResponseEntity<Map<String, Object>> getRandomQuestions(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        
        try {
            User user = userService.getCurrentUser(authentication.getName());
            List<QuestionDto> questions = questionService.getRandomQuestions(limit);
            
            // セッション作成
            Session session = sessionService.createSession(user, limit);
            
            return ResponseEntity.ok(Map.of(
                    "sessionId", session.getId(),
                    "questions", questions
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 