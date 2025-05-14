package com.library_web.library.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import com.library_web.library.dto.BorrowCardDTO.BookInfo;

@Data
public class BorrowCardDTO {
  private Long id;
  private Long userId;
  private String userName;
  private List<BookInfo> bookIds;
  private LocalDateTime borrowDate;
  private LocalDateTime dueDate;
  private LocalDateTime getBookDate;
  private String status;
  private int totalBooks; // Số lượng sách mượn

  public static class BookInfo {
    private String image;

    public String getImage() {
      return image;
    }

    public void setImage(String image) {
      this.image = image;
    }

    private String name;

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    private String author;
    private String category;
    private String publisher;
    private int borrowCount;

    public String getAuthor() {
      return author;
    }

    public void setAuthor(String author) {
      this.author = author;
    }

    public String getCategory() {
      return category;
    }

    public void setCategory(String category) {
      this.category = category;
    }

    public String getPublisher() {
      return publisher;
    }

    public void setPublisher(String publisher) {
      this.publisher = publisher;
    }

    public int getBorrowCount() {
      return borrowCount;
    }

    public void setBorrowCount(int borrowCount) {
      this.borrowCount = borrowCount;
    }

    public BookInfo(String image, String bookName, String authorName, String categoryName, String publisher,
        Integer borrowQuantity) {
      this.image = image;
      this.name = bookName;
      this.author = authorName;
      this.category = categoryName;
      this.publisher = publisher;
      this.borrowCount = borrowQuantity;
    }
  }

  // public BorrowCardDTO(Long id, Long userId, String userName, List<BookInfo> bookIds, LocalDateTime borrowDate,
  //     LocalDateTime dueDate, LocalDateTime getBookDate, String status) {
  //   this.id = id;
  //   this.userId = userId;
  //   this.userName = userName;
  //   this.bookIds = bookIds;
  //   this.borrowDate = borrowDate;
  //   this.dueDate = dueDate;
  //   this.getBookDate = getBookDate;
  //   this.status = status;
  // }

  public BorrowCardDTO(Long id, Long userId, String username, List<BookInfo> bookInfos, LocalDateTime borrowDate, LocalDateTime getBookDate, LocalDateTime dueDate, int bookCount) {
        this.id = id;
        this.userId = userId;
        this.userName = username;
        this.bookIds = bookInfos;
        this.borrowDate = borrowDate;
        this.getBookDate = getBookDate;
        this.dueDate = dueDate;
        this.totalBooks = bookCount;
    }

}