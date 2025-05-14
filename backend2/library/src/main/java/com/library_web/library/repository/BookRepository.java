package com.library_web.library.repository;

import com.library_web.library.model.Book;
import com.library_web.library.model.Book.TrangThai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByTenSachAndTenTacGia(String tenSach, String tenTacGia);
    List<Book> findByCategoryChild_Id(String categoryChildId);
    // List<Book> findAllById(List<Long> bookIds);
    List<Book> findByCreatedAtAfter(LocalDate date);
    List<Book> findByTrangThaiNot(TrangThai trangThai);
    List<Book> findByCreatedAtAfterAndTrangThaiNot(LocalDate date, TrangThai trangThai);
}
