package com.library_web.library.controller;

import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.library_web.library.service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")

public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

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

        if (response == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đăng nhập không thành công");
        }

        // Lấy role
        Map<String, Object> data = (Map<String, Object>) response.get("data");
        Map<String, Object> userData = (Map<String, Object>) data.get("user");
        String role = (String) userData.get("role");

        if (!"ADMIN".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền truy cập");
        }

        return response;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/users")
    public Map<String, Object> getAllUsers() {
        List<User> users = userRepository.findAll();
        return Map.of(
                "message", "Danh sách người dùng",
                "data", users);
    }

    @DeleteMapping("/users/{id}")
    public Map<String, Object> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với ID: " + id);
        }
        userRepository.deleteById(id);
        return Map.of(
                "message", "Xóa người dùng với ID " + id + " thành công",
                "data", Map.of("id", id));
    }
}