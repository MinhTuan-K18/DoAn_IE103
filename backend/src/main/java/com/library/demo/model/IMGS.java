package com.library.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "IMGS")
public class IMGS {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MAIMG")
    private int maImg;

    @Column(name = "IMG", nullable = false)
    private String img;

    @ManyToOne
    @JoinColumn(name = "MASACH")
    private Sach sach;

    public IMGS() {}

    public int getMaImg() { return maImg; }
    public void setMaImg(int maImg) { this.maImg = maImg; }

    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }

    public Sach getSach() { return sach; }
    public void setSach(Sach sach) { this.sach = sach; }
}