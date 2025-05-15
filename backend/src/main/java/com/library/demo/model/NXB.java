package com.library.demo.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "NXB")
@Data
public class NXB {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MANXB")
    private Integer maNXB;

    @Column(name = "TENNXB")
    private String tenNXB;

    @OneToMany(mappedBy = "nxb")
    private List<Sach> sachs;
    public NXB() {
    }
    
    public NXB(Integer maNXB, String tenNXB) {
        this.maNXB = maNXB;
        this.tenNXB = tenNXB;
    }
    public Integer getMaNXB() {
        return maNXB;
    }
    public void setMaNXB(Integer maNXB) {
        this.maNXB = maNXB;
    }
    public String getTenNXB() {
        return tenNXB;
    }
    public void setTenNXB(String tenNXB) {
        this.tenNXB = tenNXB;
    }
    public List<Sach> getSachs() {
        return sachs;
    }
    public void setSachs(List<Sach> sachs) {
        this.sachs = sachs;
    }
    public NXB(String tenNXB) {
        this.tenNXB = tenNXB;
    }
    public NXB(Integer maNXB) {
        this.maNXB = maNXB;
    }
    public NXB(String tenNXB, List<Sach> sachs) {
        this.tenNXB = tenNXB;
        this.sachs = sachs;
    }
}
