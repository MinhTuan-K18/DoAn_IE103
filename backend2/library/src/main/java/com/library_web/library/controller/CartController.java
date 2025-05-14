package com.library_web.library.controller;

import com.library_web.library.dto.CartItemDTO;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.service.CartService;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {
    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }
/*
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = authService.authenticate(request.getUsername(), request.getPassword());
        if (user != null) {
            // Tạo hoặc lấy giỏ hàng tự động khi đăng nhập thành công
            cartService.getOrCreateCart(user);
            return ResponseEntity.ok("Đăng nhập thành công");
        }
        return ResponseEntity.status(401).body("Đăng nhập thất bại");
    }
    

    private User getCurrentUser() {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
    }
*/
    @PostMapping("/{userId}/add/books")
    public ResponseEntity<?> addBooksToCart(
            @PathVariable Long userId,
            @RequestBody List<Long> bookIds) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            cartService.addBooksToCart(user, bookIds);
            return ResponseEntity.ok(Map.of("message", "Đã thêm sách vào giỏ"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/remove/books")
    public ResponseEntity<?> removeBooksFromCart(
            @PathVariable Long userId,
            @RequestBody List<Long> bookIds){
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            cartService.removeBooksFromCart(user, bookIds);
            return ResponseEntity.ok(Map.of("message", "Đã xóa sách khỏi giỏ"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCartDetails(
            @PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            List<CartItemDTO> items = cartService.getCartDetails(user);
            return ResponseEntity.ok(Map.of("message", "Danh sách sách trong giỏ hàng", "data", items));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

}