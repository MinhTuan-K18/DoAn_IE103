package com.library_web.library.model;

import jakarta.persistence.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;
@Entity
public class Cart {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonManagedReference
    private User user;

    @Column(name = "so_luong_sach")
    private Integer soLuongSach = 0;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    public Cart() {
        this.soLuongSach = 0;
    }
    public Long getId() {
        return id; 
    }
    public void setId(Long id) {
        this.id = id; 
    }
    public void setUser(User user) {
        this.user = user; 
    }
    public Integer getSoLuongSach() {
        return soLuongSach; 
    }
    public void setSoLuongSach(Integer soLuongSach) {
        this.soLuongSach = soLuongSach; 
    }
    public List<CartItem> getItems() {
        return items; 
    }
    public void setItems(List<CartItem> items) {
        this.items = items; 
    }
    public void addItem(CartItem item) {
        if (!items.stream().anyMatch(i -> i.getBook().getMaSach().equals(item.getBook().getMaSach()))) {
            items.add(item);
            item.setCart(this);
            soLuongSach++;
        }
    }

    public void removeItem(CartItem item) {
        if (items.remove(item)) {
            soLuongSach--;
        }
    }
}