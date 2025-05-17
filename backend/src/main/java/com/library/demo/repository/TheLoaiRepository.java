package com.library.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.demo.model.TheLoai;

public interface TheLoaiRepository extends JpaRepository<TheLoai, Long> {
    Optional<TheLoai> findByTenTheLoai(String tenTheLoai);
}