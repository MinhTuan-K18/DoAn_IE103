package com.library_web.library.repository;
import com.library_web.library.model.BookChild;
import com.library_web.library.model.BookChild.Status;
//import com.library_web.library.model.BookChild.Status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookChildRepository extends JpaRepository<BookChild, String> {
    List<BookChild> findByBookMaSachOrderByIdAsc(Long bookId);
    List<BookChild> findByStatus(Status status);
    long countByBookMaSachAndStatus(Long bookId, Status status);
    long countByBookMaSach(Long bookId);
    @Query("SELECT COUNT(bc) FROM BookChild bc WHERE bc.book.maSach = :maSach AND bc.status IN (com.library_web.library.model.BookChild.Status.AVAILABLE, com.library_web.library.model.BookChild.Status.BORROWED)")
    long countActiveByBookMaSach(@Param("maSach") Long maSach);
}