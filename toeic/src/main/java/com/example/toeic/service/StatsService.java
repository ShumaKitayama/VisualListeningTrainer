package com.example.toeic.service;

import com.example.toeic.dto.StatsResponse;
import com.example.toeic.entity.Result;
import com.example.toeic.repository.ResultRepository;
import com.example.toeic.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatsService {

    private final ResultRepository resultRepository;
    private final SessionRepository sessionRepository;

    public StatsResponse getUserStats(Long userId) {
        // 全期間統計
        Long totalAnswers = resultRepository.countTotalAnswersByUserId(userId);
        Long correctAnswers = resultRepository.countCorrectAnswersByUserId(userId);
        Double overallAccuracy = totalAnswers > 0 ? (double) correctAnswers / totalAnswers * 100 : 0.0;

        // 直近7日統計
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<Result> recentResults = resultRepository.findByUserIdAndAnsweredAtAfter(userId, weekAgo);
        Double recentAccuracy = calculateAccuracy(recentResults);

        // セッション数
        Long totalSessions = sessionRepository.countByUserId(userId);

        // 日別統計
        List<com.example.toeic.dto.DailyStats> dailyStats = calculateDailyStats(userId);

        return new StatsResponse(
                overallAccuracy,
                recentAccuracy,
                totalAnswers.intValue(),
                correctAnswers.intValue(),
                totalSessions.intValue(),
                dailyStats
        );
    }

    private Double calculateAccuracy(List<Result> results) {
        if (results.isEmpty()) return 0.0;
        
        long correct = results.stream().mapToLong(result -> result.getIsCorrect() ? 1 : 0).sum();
        return (double) correct / results.size() * 100;
    }

    private List<com.example.toeic.dto.DailyStats> calculateDailyStats(Long userId) {
        try {
        List<Object[]> rawStats = resultRepository.findDailyStatsByUserId(userId);
        List<com.example.toeic.dto.DailyStats> dailyStats = new ArrayList<>();

        for (Object[] row : rawStats) {
                // null値チェック
                if (row == null || row.length < 3 || row[0] == null) {
                    continue;
                }
                
                // java.sql.Date を LocalDate に正しく変換
                java.sql.Date sqlDate = (java.sql.Date) row[0];
                LocalDate date = sqlDate.toLocalDate();
            Long total = (Long) row[1];
            Long correct = (Long) row[2];
            Double accuracy = total > 0 ? (double) correct / total * 100 : 0.0;

            dailyStats.add(new com.example.toeic.dto.DailyStats(date, accuracy, total.intValue()));
        }

        return dailyStats;
        } catch (Exception e) {
            // エラーが発生した場合は空のリストを返す
            return new ArrayList<>();
        }
    }
}
