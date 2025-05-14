package com.library_web.library.controller;

import com.library_web.library.dto.UserDTO;

import com.library_web.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.library_web.library.model.User;
import com.library_web.library.model.Cart;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.service.UserService;
import com.library_web.library.service.GoogleAuthService;
import com.library_web.library.service.FacebookAuthService;
import com.library_web.library.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private FacebookAuthService facebookAuthService;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody UserDTO userDTO) {
        if (userDTO == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu đăng ký không được để trống");
        }
        return userService.register(userDTO);
    }

    @PostMapping("/register/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        if (email == null || email.isBlank() || otp == null || otp.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email và OTP không được để trống");
        }

        return userService.verifyOtpAndCreate(email, otp);
    }

    @PostMapping("/forgot-password")
    public Map<String, Object> forgotPassword(@RequestBody Map<String, String> request) {
        String emailOrPhone = request.get("emailOrPhone");
        if (emailOrPhone == null || emailOrPhone.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email hoặc số điện thoại không được để trống");
        }

        return userService.forgotPassword(emailOrPhone);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        // Lấy email hoặc phone từ request
        String emailOrPhone = request.get("email");
        if (emailOrPhone == null || emailOrPhone.isBlank()) {
            emailOrPhone = request.get("phone");
            if (emailOrPhone == null || emailOrPhone.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Email hoặc số điện thoại không được cung cấp");
            }
        }
        String password = request.get("password");

        // Kiểm tra input
        if (password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu không được để trống");
        }

        // Gọi phương thức login từ UserService
        Map<String, Object> response = userService.login(emailOrPhone, password);

        // Kiểm tra đăng nhập thành công và tạo/lấy giỏ hàng
        if (response.containsKey("data") && ((Map<String, Object>) response.get("data")).containsKey("accessToken")) {
            Map<String, Object> userData = (Map<String, Object>) ((Map<String, Object>) response.get("data"))
                    .get("user");
            String username = (String) userData.get("username");
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Không tìm thấy người dùng sau khi đăng nhập"));
            cartService.getOrCreateCart(user);
        }

        return response;
    }

    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> request) {
        String emailOrPhone = request.get("emailOrPhone");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (emailOrPhone == null || emailOrPhone.isBlank() || otp == null || otp.isBlank() || newPassword == null
                || newPassword.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Email/số điện thoại, OTP và mật khẩu mới không được để trống");

        }

        return userService.resetPassword(emailOrPhone, otp, newPassword);
    }

    @PostMapping("/auth/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> body) {
        String accessToken = body.get("googleAccessToken");

        try {
            Map<String, Object> response = googleAuthService.signInWithGoogle(accessToken);

            // Tạo hoặc lấy giỏ hàng nếu đăng nhập thành công
            if (response.containsKey("data")
                    && ((Map<String, Object>) response.get("data")).containsKey("accessToken")) {
                String email = (String) ((Map<String, Object>) response.get("data")).get("user.email");
                if (email != null) {
                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                    "Không tìm thấy người dùng sau khi đăng nhập bằng Google"));
                    cartService.getOrCreateCart(user);
                }
            }

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Google Login thất bại: " + ex.getMessage()));
        }
    }

    @PostMapping("/auth/facebook")
    public ResponseEntity<?> loginWithFacebook(@RequestBody Map<String, String> body) {
        String accessToken = body.get("accessToken");

        try {
            Map<String, Object> response = facebookAuthService.signInWithFacebook(accessToken);

            // Tạo hoặc lấy giỏ hàng nếu đăng nhập thành công
            if (response.containsKey("data")
                    && ((Map<String, Object>) response.get("data")).containsKey("accessToken")) {
                String username = (String) ((Map<String, Object>) response.get("data")).get("user.username");
                if (username != null) {
                    User user = userRepository.findByUsername(username)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                    "Không tìm thấy người dùng sau khi đăng nhập bằng Facebook"));
                    cartService.getOrCreateCart(user);
                }
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "FAIL", "message", e.getMessage()));
        }
    }

    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPasswordDuplicate(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(userService.resetPassword(
                request.get("emailOrPhone"),
                request.get("otp"),
                request.get("newPassword")));
    }

    @GetMapping("/refresh-token")
    public Map<String, Object> refreshToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yêu cầu header Authorization với Bearer Token");
        }

        String refreshToken = authHeader.substring(7); // Bỏ "Bearer " (7 ký tự)
        if (refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh Token không được để trống");
        }

        return userService.refreshAccessToken(refreshToken);
    }

}