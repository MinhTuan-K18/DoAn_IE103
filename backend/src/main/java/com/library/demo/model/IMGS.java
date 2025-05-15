package com.library.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "IMGS")
public class IMGS {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MAIMG")
    private int maImg;

    @Column(name = "MASACH")
    private int maSach;

    @Column(name = "IMG")
    private String img;

    // Getters và setters
    public int getMaImg() { return maImg; }
    public void setMaImg(int maImg) { this.maImg = maImg; }

    public int getMaSach() { return maSach; }
    public void setMaSach(int maSach) { this.maSach = maSach; }

    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }
}
