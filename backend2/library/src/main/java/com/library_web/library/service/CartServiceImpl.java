package com.library_web.library.service;
import com.library_web.library.dto.CartItemDTO;
import com.library_web.library.model.Book;
import com.library_web.library.model.Cart;
import com.library_web.library.model.CartItem;
import com.library_web.library.model.User;
import com.library_web.library.repository.BookRepository;
import com.library_web.library.repository.CartItemRepository;
import com.library_web.library.repository.CartRepository;

import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CartServiceImpl implements CartService{
    private final BookRepository bookRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    public CartServiceImpl(
        BookRepository bookRepository,
        CartRepository cartRepository,
        CartItemRepository cartItemRepository
    ) {
        this.bookRepository = bookRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Override    
    @Transactional
    public Cart getOrCreateCart(User user) {
        Cart cart = cartRepository.findByUser(user);
        if (cart == null) {
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setSoLuongSach(0);
            return cartRepository.save(newCart);
        }
        return cart;
    }

    @Override    
    @Transactional
    public void addBooksToCart(User user, List<Long> bookIds) {
        Cart cart = getOrCreateCart(user);
        for (Long bookId : bookIds) {
            Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Không tìm thấy sách với id " + bookId));
        CartItem existingItem = cartItemRepository.findByCartAndBook(cart, book);
        if (existingItem != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Có sách đã tồn tại trong giỏ");
        }
        CartItem item = new CartItem();
        item.setCart(cart);
        item.setBook(book);
        cart.addItem(item);
        cartItemRepository.save(item);
        }
    cartRepository.save(cart);
    }

     @Override
    @Transactional
    public void removeBooksFromCart(User user, List<Long> bookIds) {
        Cart cart = getOrCreateCart(user);
        for (Long bookId : bookIds) {
            Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Không tìm thấy sách với id " + bookId));
        CartItem item = cartItemRepository.findByCartAndBook(cart, book);
        if (item != null) {
                cart.removeItem(item);
                cartItemRepository.delete(item);
            }
        }
        cartRepository.save(cart);
    }

     @Override
    @Transactional
    public List<CartItemDTO> getCartDetails(User user) {
        Cart cart = getOrCreateCart(user);
        return cartItemRepository.findByCart(cart).stream()
            .map(item -> new CartItemDTO(item.getBook()))
            .collect(Collectors.toList());
    }
}
/*
     @Override
    @Transactional
    public void updateQuantity(User user, Long bookId, int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        Cart cart = getOrCreateCart(user);
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sách"));
        CartItem item = cartItemRepository.findByCartAndBook(cart, book);
        if (item == null) throw new RuntimeException("Sách không có trong giỏ");
        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }
*/