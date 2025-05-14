package com.library_web.library.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class BookChild {
    
    @Id
    private String id; 

    @Enumerated(EnumType.STRING)
    private Status status = Status.AVAILABLE;

    private LocalDate addedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnore
    private Book book;

    public enum Status { AVAILABLE, BORROWED, NOT_AVAILABLE }

    public BookChild() {}
    public BookChild(Book book, String suffix) {
        this.id = book.getMaSach() + suffix;
        this.book = book;
        this.addedDate = LocalDate.now();
        this.status = Status.AVAILABLE;
    }
    public String getId() {
        return id; 
    }
    public Status getStatus() {
        return status; 
    }
    public void setStatus(Status status) {
        this.status = status; 
    }
    public LocalDate getAddedDate() {
        return addedDate; 
    }
    public void setAddedDate(LocalDate addedDate) { 
        this.addedDate = addedDate; 
    }
    public Book getBook() {
        return book; 
    }
    public void setBook(Book book) {
        this.book = book; 
    }

    public boolean isAvailable() {
        return status == Status.AVAILABLE; 
    }
    public void borrow() {
        if (status != Status.AVAILABLE) throw new IllegalStateException("Không thể mượn");
        status = Status.BORROWED;
        book.onBorrow();
    }
    public void returnBack() {
        if (status != Status.BORROWED) throw new IllegalStateException("Không thể trả");
        status = Status.AVAILABLE;
        book.onReturn();
    }
    public void markNotAvailable() {
        if (status == Status.NOT_AVAILABLE) throw new IllegalStateException("Đã là NOT_AVAILABLE");
        status = Status.NOT_AVAILABLE;
    }
    
}
