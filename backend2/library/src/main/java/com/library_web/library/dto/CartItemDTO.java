package com.library_web.library.dto;

import java.util.List;

import com.library_web.library.model.Book;

public class CartItemDTO {

    private Long bookId;
    private String tenSach;
    private String moTa;
    private String tenTacGia;
    private String nxb;
    private Integer nam;
    private Integer trongLuong;
    private Integer donGia;
    private Integer tongSoLuong;
    private Integer soLuongMuon;
    private Integer soLuongXoa;
    private String trangThai;
    private List<String> hinhAnh;
    private String categoryChildId;
    private String categoryChildName;
    private String categoryParentName;

    public CartItemDTO(Book book) {
        this.bookId = book.getMaSach();
        this.tenSach = book.getTenSach();
        this.moTa = book.getMoTa();
        this.tenTacGia = book.getTenTacGia();
        this.nxb = book.getNxb();
        this.nam = book.getNam();
        this.trongLuong = book.getTrongLuong();
        this.donGia = book.getDonGia();
        this.tongSoLuong = book.getTongSoLuong();
        this.soLuongMuon = book.getSoLuongMuon();
        this.soLuongXoa = book.getSoLuongXoa();
        this.trangThai = book.getTrangThai().name();
        this.hinhAnh = book.getHinhAnh();
        this.categoryChildId = book.getCategoryChild().getId();
        this.categoryChildName = book.getCategoryChild().getName();
        this.categoryParentName = book.getCategoryChild().getCategoryName();
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getTenSach() {
        return tenSach;
    }

    public void setTenSach(String tenSach) {
        this.tenSach = tenSach;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public String getTenTacGia() {
        return tenTacGia;
    }

    public void setTenTacGia(String tenTacGia) {
        this.tenTacGia = tenTacGia;
    }

    public String getNxb() {
        return nxb;
    }

    public void setNxb(String nxb) {
        this.nxb = nxb;
    }

    public Integer getNam() {
        return nam;
    }

    public void setNam(Integer nam) {
        this.nam = nam;
    }

    public Integer getTrongLuong() {
        return trongLuong;
    }

    public void setTrongLuong(Integer trongLuong) {
        this.trongLuong = trongLuong;
    }

    public Integer getDonGia() {
        return donGia;
    }

    public void setDonGia(Integer donGia) {
        this.donGia = donGia;
    }

    public Integer getTongSoLuong() {
        return tongSoLuong;
    }

    public void setTongSoLuong(Integer tongSoLuong) {
        this.tongSoLuong = tongSoLuong;
    }

    public Integer getSoLuongMuon() {
        return soLuongMuon;
    }

    public void setSoLuongMuon(Integer soLuongMuon) {
        this.soLuongMuon = soLuongMuon;
    }

    public Integer getSoLuongXoa() {
        return soLuongXoa;
    }

    public void setSoLuongXoa(Integer soLuongXoa) {
        this.soLuongXoa = soLuongXoa;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public List<String> getHinhAnh() {
        return hinhAnh;
    }

    public void setHinhAnh(List<String> hinhAnh) {
        this.hinhAnh = hinhAnh;
    }

    public String getCategoryChildId() {
        return categoryChildId;
    }

    public void setCategoryChildId(String categoryChildId) {
        this.categoryChildId = categoryChildId;
    }

    public String getCategoryChildName() {
        return categoryChildName;
    }

    public void setCategoryChildName(String categoryChildName) {
        this.categoryChildName = categoryChildName;
    }

    public String getCategoryParentName() {
        return categoryParentName;
    }

    public void setCategoryParentName(String categoryParentName) {
        this.categoryParentName = categoryParentName;
    }
}
