package com.example.toeic.controller;

import com.example.toeic.dto.AnswerRequest;
import com.example.toeic.entity.Choice;
import com.example.toeic.entity.Result;
import com.example.toeic.entity.User;
import com.example.toeic.service.ResultService;
import com.example.toeic.service.SessionService;
import com.example.toeic.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResultController {

    private final ResultService resultService;
    private final SessionService sessionService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitAnswer(
            @Valid @RequestBody AnswerRequest request,
            Authentication authentication) {
        
        try {
            User user = userService.getCurrentUser(authentication.getName());
            Result result = resultService.submitAnswer(request, user);
            
            // 正解の選択肢を取得
            Choice correctChoice = resultService.getCorrectChoice(request.getQuestionId());
            
            return ResponseEntity.ok(Map.of(
                    "isCorrect", result.getIsCorrect(),
                    "resultId", result.getId(),
                    "correctChoice", Map.of(
                            "id", correctChoice.getId(),
                            "sentence", correctChoice.getSentence()
                    )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/session/{sessionId}/finish")
    public ResponseEntity<Map<String, Object>> finishSession(
            @PathVariable Long sessionId,
            Authentication authentication) {
        
        try {
            User user = userService.getCurrentUser(authentication.getName());
            int correctAnswers = resultService.calculateCorrectAnswers(sessionId);
            sessionService.finishSession(sessionId, correctAnswers);
            
            return ResponseEntity.ok(Map.of(
                    "correctAnswers", correctAnswers,
                    "sessionId", sessionId
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 