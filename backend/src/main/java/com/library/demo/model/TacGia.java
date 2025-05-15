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
@Table(name = "TACGIA")
@Data
public class TacGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MATG")
    private Integer maTG;

    @Column(name = "TENTG")
    private String tenTG;

    @ManyToMany(mappedBy = "tacGias")
    private List<Sach> sachs;

    public TacGia() {
    }
    public TacGia(Integer maTG, String tenTG) {
        this.maTG = maTG;
        this.tenTG = tenTG;
    }
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
