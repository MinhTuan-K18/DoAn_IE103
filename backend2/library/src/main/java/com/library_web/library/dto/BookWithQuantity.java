package com.library_web.library.dto;

import com.library_web.library.model.Book;

public class BookWithQuantity {

    private Book book;
    private int quantity;

    public BookWithQuantity() {}

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    
}
