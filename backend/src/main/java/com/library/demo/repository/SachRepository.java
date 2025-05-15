package com.library.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.library.demo.model.Sach;

public interface SachRepository extends JpaRepository<Sach, Integer> {
    @Query("SELECT s FROM Sach s " +
           "JOIN s.theLoais tl " +
           "JOIN s.tacGias tg " +
           "JOIN s.nxb nxb " +  
           "WHERE (:keyword IS NULL OR " +
           "LOWER(s.tenSach) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(tl.tenTheLoai) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(tg.tenTG) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(nxb.tenNXB) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Sach> searchBooks(@Param("keyword") String keyword, Pageable pageable);
}