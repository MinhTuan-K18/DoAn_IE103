package com.library.demo.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "THELOAI")
@Data
public class TheLoai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MATL")
    private Integer maTL;

    @Column(name = "TENTHELOAI")
    private String tenTheLoai;

    @ManyToMany(mappedBy = "theLoais")
    private List<Sach> sachs;

    public TheLoai() {
    }
    public TheLoai(String tenTheLoai) {
        this.tenTheLoai = tenTheLoai;
    }
    public TheLoai(Integer maTL, String tenTheLoai) {
        this.maTL = maTL;
        this.tenTheLoai = tenTheLoai;
    }
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
    public List<Sach> getSachs() {
        return sachs;
    }
    public void setSachs(List<Sach> sachs) {
        this.sachs = sachs;
    }

}
