package com.example.toeic.service;

import com.example.toeic.dto.AnswerRequest;
import com.example.toeic.entity.*;
import com.example.toeic.repository.ResultRepository;
import com.example.toeic.repository.ChoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ResultService {

    private final ResultRepository resultRepository;
    private final ChoiceRepository choiceRepository;
    private final SessionService sessionService;
    private final QuestionService questionService;

    public Result submitAnswer(AnswerRequest request, User user) {
        Session session = sessionService.findById(request.getSessionId());
        Question question = questionService.findById(request.getQuestionId());
        Choice selectedChoice = choiceRepository.findById(request.getChoiceId())
                .orElseThrow(() -> new RuntimeException("Choice not found"));

        // 正解判定
        boolean isCorrect = selectedChoice.getIsCorrect();

        Result result = new Result();
        result.setUser(user);
        result.setSession(session);
        result.setQuestion(question);
        result.setChoice(selectedChoice);
        result.setIsCorrect(isCorrect);

        return resultRepository.save(result);
    }

    @Transactional(readOnly = true)
    public List<Result> getSessionResults(Long sessionId) {
        return resultRepository.findBySessionId(sessionId);
    }

    @Transactional(readOnly = true)
    public List<Result> getUserResults(Long userId) {
        return resultRepository.findByUserIdOrderByAnsweredAtDesc(userId);
    }

    public int calculateCorrectAnswers(Long sessionId) {
        List<Result> results = resultRepository.findBySessionId(sessionId);
        return (int) results.stream().mapToLong(r -> r.getIsCorrect() ? 1 : 0).sum();
    }

    @Transactional(readOnly = true)
    public Choice getCorrectChoice(Long questionId) {
        Question question = questionService.findById(questionId);
        return question.getChoices().stream()
                .filter(Choice::getIsCorrect)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Correct choice not found for question: " + questionId));
    }
} 