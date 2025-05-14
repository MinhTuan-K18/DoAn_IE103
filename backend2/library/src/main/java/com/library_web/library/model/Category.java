package com.library_web.library.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer soLuongDanhMuc = 0;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CategoryChild> children = new ArrayList<>();

    public Category() {}

    public Long getId() {
        return id; 
    }
    public String getName() {
        return name; 
    }
    public void setName(String name) {
        this.name = name; 
    }

    public Integer getSoLuongDanhMuc() {
        return soLuongDanhMuc; 
    }
    public void setSoLuongDanhMuc(Integer soLuongDanhMuc) {
        this.soLuongDanhMuc = soLuongDanhMuc; 
    }

    public List<CategoryChild> getChildren() {
        return children; 
    }
    public void setChildren(List<CategoryChild> children) {
        this.children = children; 
    }

    public void addChild(CategoryChild child) {
        if (!children.contains(child)) {
            children.add(child);
            child.setParent(this);
            soLuongDanhMuc++;
        }
    }

    public void removeChild(CategoryChild child) {
        if (children.remove(child)) {
            child.setParent(null);
            soLuongDanhMuc--;
        }
    }
}
