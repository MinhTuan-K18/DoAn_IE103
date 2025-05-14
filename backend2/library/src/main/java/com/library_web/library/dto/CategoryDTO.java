package com.library_web.library.dto;

import java.util.List;

public class CategoryDTO {
    private Long id;
    private String name;
    private Integer soLuongDanhMuc;
    private List<CategoryChildDTO> children;

    public CategoryDTO() {
    }

    public CategoryDTO(Long id, String name, Integer soLuongDanhMuc, List<CategoryChildDTO> children) {
        this.id = id;
        this.name = name;
        this.soLuongDanhMuc = soLuongDanhMuc;
        this.children = children;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<CategoryChildDTO> getChildren() {
        return children;
    }

    public void setChildren(List<CategoryChildDTO> children) {
        this.children = children;
    }
}
