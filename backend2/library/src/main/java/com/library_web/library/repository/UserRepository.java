package com.library_web.library.repository;

import com.library_web.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // Tìm kiếm theo tên đăng nhập
    Optional<User> findByEmail(String email); // Tìm kiếm theo email
    Optional<User> findByFullname(String fullname); // Tìm kiếm theo tên đầy đủ
    Optional<User> findByPhone(String phone); // Tìm kiếm theo số điện thoại
    Optional<User> findById(Long id);
}