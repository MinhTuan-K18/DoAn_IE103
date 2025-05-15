package com.library.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "THELOAI")
@Data
public class TheLoai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MATL")
    private Integer maTL;

    @Column(name = "TENTHELOAI", nullable = false)
    private String tenTheLoai;

    @ManyToMany(mappedBy = "theLoais")
    private List<Sach> sachs;

    public TheLoai() {}
    public Integer getMaTL() {
        return maTL;
    }
    public void setMaTL(Integer maTL) {
        this.maTL = maTL;
    }
    public String getTenTheLoai() {
        return tenTheLoai;
    }
    public void setTenTheLoai(String tenTheLoai) {
        this.tenTheLoai = tenTheLoai;
    }
   
}