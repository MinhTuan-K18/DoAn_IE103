package com.library_web.library.repository;

import com.library_web.library.model.BorrowCard;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowCardRepository extends JpaRepository<BorrowCard, Long> {
  List<BorrowCard> findByUserId(Long userId);
}