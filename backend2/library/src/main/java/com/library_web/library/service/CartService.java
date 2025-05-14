package com.library_web.library.service;

import java.util.List;

import com.library_web.library.dto.CartItemDTO;
import com.library_web.library.model.Cart;
import com.library_web.library.model.User;

public interface CartService {
    Cart getOrCreateCart(User user);
    void addBooksToCart(User user, List<Long> bookIds);
    void removeBooksFromCart(User user, List<Long> bookIds);
    List<CartItemDTO> getCartDetails(User user);
    //void updateQuantity (User user, Long bookId, int quantity);

}