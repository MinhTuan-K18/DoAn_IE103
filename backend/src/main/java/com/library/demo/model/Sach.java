package com.library.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

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

    @Column(name = "NAMXB")
    private Integer namXB;

    @Column(name = "TAIBAN")
    private Integer taiBan;

    @Column(name = "NGONNGU")
    private String ngonNgu;

    @Column(name = "SOLUONG")
    private Integer soLuong;

    @Column(name = "CHUTHICH")
    private String chuThich;

    @Column(name = "TINHTRANG")
    private String tinhTrang;

    @ManyToOne
    @JoinColumn(name = "MANXB")
    private NXB nxb;

    @ManyToMany
    @JoinTable(
        name = "THELOAI_SACH",
        joinColumns = @JoinColumn(name = "MASACH"),
        fungiJoinColumns = @JoinColumn(name = "MATL")
    )
    private List<TheLoai> theLoais;

    @ManyToMany
    @JoinTable(
        name = "TACGIA_SACH",
        joinColumns = @JoinColumn(name = "MASACH"),
        inverseJoinColumns = @JoinColumn(name = "MATG")
    )
    private List<TacGia> tacGias;

    public Sach() {}
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