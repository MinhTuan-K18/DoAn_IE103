package com.library_web.library.service;

import com.library_web.library.model.BookChild;
import java.util.List;


public interface BookChildService {
    List<BookChild> getChildrenByBook(Long bookId);
    List<BookChild> findByStatus(BookChild.Status status);
    BookChild addChild(Long bookId);
   // BookChild updateChild(String childId, Map<String, Object> updates);
    void deleteChild(String childId);
    BookChild borrowChild(String childId);
    BookChild returnChild(String childId);
}