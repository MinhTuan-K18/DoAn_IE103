package com.library_web.library.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library_web.library.model.Book;
import com.library_web.library.model.Cart;
import com.library_web.library.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndBook(Cart cart, Book book);
    List<CartItem> findByCart(Cart cart); 
}

