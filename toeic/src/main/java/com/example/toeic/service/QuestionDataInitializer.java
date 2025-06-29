package com.example.toeic.service;

import com.example.toeic.entity.Question;
import com.example.toeic.entity.Choice;
import com.example.toeic.repository.QuestionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
public class QuestionDataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(QuestionDataInitializer.class);

    private final QuestionRepository questionRepository;
    private final ObjectMapper objectMapper;

    public QuestionDataInitializer(QuestionRepository questionRepository, ObjectMapper objectMapper) {
        this.questionRepository = questionRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        // データベースが空の場合のみ初期データを投入
        if (questionRepository.count() == 0) {
            log.info("Initializing question data...");
            loadQuestionsFromJson();
            log.info("Question data initialization completed.");
        } else {
            log.info("Question data already exists. Skipping initialization.");
        }
    }

    private void loadQuestionsFromJson() {
        try {
            // クラスパスからJSONファイルを読み込み
            ClassPathResource resource = new ClassPathResource("data/questions.json");
            InputStream inputStream = resource.getInputStream();
            
            JsonNode rootNode = objectMapper.readTree(inputStream);
            JsonNode questionsArray = rootNode.get("questions");

            List<Question> questions = new ArrayList<>();

            for (JsonNode questionNode : questionsArray) {
                Question question = new Question();
                // Don't set ID, let Hibernate generate it
                question.setImagePath("images/" + questionNode.get("image").asText());
                question.setExplanation(questionNode.get("explanation").asText());

                List<Choice> choices = new ArrayList<>();
                JsonNode choicesArray = questionNode.get("choices");

                for (JsonNode choiceNode : choicesArray) {
                    Choice choice = new Choice();
                    // Don't set ID, let Hibernate generate it
                    choice.setQuestion(question);
                    choice.setSentence(choiceNode.get("sentence").asText());
                    choice.setIsCorrect(choiceNode.get("is_correct").asBoolean());
                    choice.setChoiceOrder(choiceNode.get("order").asInt());
                    choices.add(choice);
                }

                question.setChoices(choices);
                questions.add(question);
            }

            questionRepository.saveAll(questions);
            log.info("Saved {} questions to database", questions.size());

        } catch (Exception e) {
            log.error("Failed to load questions from JSON", e);
            throw new RuntimeException("Failed to initialize question data", e);
        }
    }
} 