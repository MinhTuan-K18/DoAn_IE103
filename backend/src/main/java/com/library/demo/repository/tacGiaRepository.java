package com.library.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.demo.model.TacGia;

public interface tacGiaRepository extends JpaRepository<TacGia, Long> {
    Optional<TacGia> findByTenTG(String tenTG);
}