package com.example.toeic.controller;

import com.example.toeic.dto.StatsResponse;
import com.example.toeic.entity.User;
import com.example.toeic.service.StatsService;
import com.example.toeic.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class StatsController {

    private final StatsService statsService;
    private final UserService userService;

    @GetMapping("/overview")
    public ResponseEntity<?> getStatsOverview(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Unauthorized access attempt to stats overview.");
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required."));
        }

        String username = authentication.getName();
        try {
            log.info("Stats overview requested by user: {}", username);
            User user = userService.getCurrentUser(username);
            log.info("User found: {}", user.getEmail());
            StatsResponse stats = statsService.getUserStats(user.getId());
            log.info("Stats retrieved successfully for user: {}", user.getEmail());
            return ResponseEntity.ok(stats);
        } catch (UsernameNotFoundException e) {
            log.error("User not found while retrieving stats: {}", username, e);
            return ResponseEntity.status(401).body(Map.of("error", "User not found, please log in again.", "type", e.getClass().getSimpleName()));
        } catch (Exception e) {
            log.error("Error retrieving stats for user: {}", username, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage(), "type", e.getClass().getSimpleName()));
        }
    }
} 