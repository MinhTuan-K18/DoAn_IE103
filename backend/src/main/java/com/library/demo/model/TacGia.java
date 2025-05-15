package com.library.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "TACGIA")
@Data
public class TacGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MATG")
    private Integer maTG;

    @Column(name = "TENTG", nullable = false)
    private String tenTG;

    @ManyToMany(mappedBy = "tacGias")
    private List<Sach> sachs;

    public TacGia() {}
    public Integer getMaTG() {
        return maTG;
    }
    public void setMaTG(Integer maTG) {
        this.maTG = maTG;
    }
    public String getTenTG() {
        return tenTG;
    }
    public void setTenTG(String tenTG) {
        this.tenTG = tenTG;
    }
    
}