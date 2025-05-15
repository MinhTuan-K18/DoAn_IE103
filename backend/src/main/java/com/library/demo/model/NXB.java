package com.library.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "NXB")
@Data
public class NXB {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MANXB")
    private Integer maNXB;

    @Column(name = "TENNXB", nullable = false)
    private String tenNXB;

    @OneToMany(mappedBy = "nxb")
    private List<Sach> sachs;

    public NXB() {}
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
    
}
