package com.library_web.library.service;

import com.library_web.library.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    // Tạo Access Token
    public String createAccessToken(String username) {
        return JwtUtil.generateAccessToken(username);
    }

    // Tạo Refresh Token
    public String createRefreshToken(String username) {
        return JwtUtil.generateRefreshToken(username);
    }

    // Kiểm tra tính hợp lệ của Access Token
    public boolean validateToken(String token) {
        try {
            JwtUtil.validateToken(token);  // Kiểm tra token hợp lệ
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Lấy username từ token
    public String getUsernameFromToken(String token) {
        try {
            return JwtUtil.getUsernameFromToken(token);  // Lấy username từ token
        } catch (Exception e) {
            return null;  // Nếu token không hợp lệ, trả về null
        }
    }

    // Làm mới Access Token bằng Refresh Token
    public String refreshAccessToken(String refreshToken) {
        if (validateToken(refreshToken)) {
            String username = getUsernameFromToken(refreshToken);  // Lấy username từ refresh token
            return createAccessToken(username);  // Tạo access token mới
        }
        return null; // Nếu Refresh Token không hợp lệ
    }
}
