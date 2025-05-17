package com.library.demo.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "SACH")
@Data
public class Sach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MASACH")
    private Integer maSach;

    @Column(name = "TENSACH")
    private String tenSach;

    @Column(name = "GIA")
    private Integer gia;

    @Column(name = "namxb")
    private Integer namXB;

    @Column(name = "SOLUONG")
    private Integer soLuong;

    @Column(name = "TAIBAN")
    private Integer taiBan;

    @Column(name = "TINHTRANG")
    private String tinhTrang;

    @Column(name = "CHUTHICH")
    private String chuThich;


    @ManyToOne
    @JoinColumn(name = "MANXB")
    private NXB nxb;



    @ManyToMany
    @JoinTable(
        name = "THELOAI_SACH",
        joinColumns = @JoinColumn(name = "MASACH"),
        inverseJoinColumns = @JoinColumn(name = "MATL")
    )
    private List<TheLoai> theLoais;

    @ManyToMany
    @JoinTable(
        name = "TACGIA_SACH",
        joinColumns = @JoinColumn(name = "MASACH"),
        inverseJoinColumns = @JoinColumn(name = "MATG")
    )
    private List<TacGia> tacGias;

    public Sach() {
    }
    public Sach(Integer maSach, String tenSach, Integer gia, Integer namXB, Integer soLuong, String tinhTrang,
            NXB nxb, List<TheLoai> theLoais, List<TacGia> tacGias) {
        this.maSach = maSach;
        this.tenSach = tenSach;
        this.gia = gia;
        this.namXB = namXB;
        this.soLuong = soLuong;
        this.tinhTrang = tinhTrang;
        this.nxb = nxb;
        this.theLoais = theLoais;
        this.tacGias = tacGias;
    }
    public Integer getMaSach() {
        return maSach;
    }
    public void setMaSach(Integer maSach) {
        this.maSach = maSach;
    }
    public String getTenSach() {
        return tenSach;
    }
    public void setTenSach(String tenSach) {
        this.tenSach = tenSach;
    }
    public Integer getGia() {
        return gia;
    }
    public void setGia(Integer gia) {
        this.gia = gia;
    }
    public Integer getNamXB() {
        return namXB;
    }
    public void setNamXB(Integer namXB) {
        this.namXB = namXB;
    }
    public Integer getSoLuong() {
        return soLuong;
    }
    public void setSoLuong(Integer soLuong) {
        this.soLuong = soLuong;
    }
    public String getTinhTrang() {
        return tinhTrang;
    }
    public void setTinhTrang(String tinhTrang) {
        this.tinhTrang = tinhTrang;
    }
    public NXB getNxb() {
        return nxb;
    }
    public void setNxb(NXB nxb) {
        this.nxb = nxb;
    }
    public String getChuThich() {
        return chuThich;
    }
    public void setChuThich(String chuThich) {
        this.chuThich = chuThich;
    }
    public Integer getTaiBan() {
        return taiBan;
    }
    public void setTaiBan(Integer taiBan) {
        this.taiBan = taiBan;
    }
    public List<TheLoai> getTheLoais() {
        return theLoais;
    }
    public void setTheLoais(List<TheLoai> theLoais) {
        this.theLoais = theLoais;
    }
    public List<TacGia> getTacGias() {
        return tacGias;
    }
    public void setTacGias(List<TacGia> tacGias) {
        this.tacGias = tacGias;
    }
    
}