package com.library_web.library.model;

import jakarta.persistence.*;

@Entity
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;


    public Long getId() {
        return id; 
    }
    public void setId(Long id) {
        this.id = id; 
    }
    public Cart getCart() {
        return cart; 
    }
    public void setCart(Cart cart) {
        this.cart = cart; 
    }
    public Book getBook() {
        return book; 
    }
    public void setBook(Book book) {
        this.book = book; 
    }

}
