package com.example.toeic.dto;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private Long userId;

    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, String email, Long userId) {
        this.token = token;
        this.email = email;
        this.userId = userId;
    }

    public AuthResponse(String token, String type, String email, Long userId) {
        this.token = token;
        this.type = type;
        this.email = email;
        this.userId = userId;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
} 