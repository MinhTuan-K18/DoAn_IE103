package com.library_web.library.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class BorrowedBook {

  @Column(name = "book_id")
  private Long bookId;

  @Column(name = "child_book_id")
  private String childBookId;

  public void setBookId(Long bookId) {
    this.bookId = bookId;
  }

  public void setChildBookId(String childBookId) {
    this.childBookId = childBookId;
  }

  public Long getBookId() {
    return bookId;
  }

  public String getChildBookId() {
    return childBookId;
  }

  // The constructor is removed because @AllArgsConstructor generates it automatically.
}