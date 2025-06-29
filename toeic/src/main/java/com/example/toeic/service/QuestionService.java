package com.example.toeic.service;

import com.example.toeic.dto.QuestionDto;
import com.example.toeic.entity.Question;
import com.example.toeic.entity.Choice;
import com.example.toeic.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionRepository questionRepository;

    public List<QuestionDto> getRandomQuestions(int limit) {
        List<Question> questions = questionRepository.findRandomQuestionsWithChoices(limit);
        return questions.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private QuestionDto convertToDto(Question question) {
        QuestionDto dto = new QuestionDto();
        dto.setId(question.getId());
        dto.setImagePath(question.getImagePath());
        dto.setExplanation(question.getExplanation());
        
        List<com.example.toeic.dto.ChoiceDto> choiceDtos = question.getChoices().stream()
                .map(choice -> {
                    com.example.toeic.dto.ChoiceDto choiceDto = new com.example.toeic.dto.ChoiceDto();
                    choiceDto.setId(choice.getId());
                    choiceDto.setSentence(choice.getSentence());
                    choiceDto.setChoiceOrder(choice.getChoiceOrder());
                    // 正解情報は含めない
                    return choiceDto;
                })
                .sorted((a, b) -> a.getChoiceOrder().compareTo(b.getChoiceOrder()))
                .collect(Collectors.toList());
        
        dto.setChoices(choiceDtos);
        return dto;
    }

    public Question findById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }


} 