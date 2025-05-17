package com.library.demo.DTO;

import java.util.List;

import lombok.Data;

@Data
public class SachDTO {
    private Integer maSach;
    private String tenSach;
    private Integer gia;
    private Integer namXB;
    private Integer soLuong;
    private String tinhTrang;
    private String tenNXB;
    private String chuThich;
    private Integer taiBan;
    private List<String> tenTheLoais;
    private List<String> tenTacGias;
    private List<String> hinhAnh; // Mảng chứa URL hình ảnh

    // Getters và setters
    public int getMaSach() { return maSach; }
    public void setMaSach(int maSach) { this.maSach = maSach; }
    public String getTenSach() { return tenSach; }
    public void setTenSach(String tenSach) { this.tenSach = tenSach; }
    public List<String> getTenTacGias() { return tenTacGias; }
    public void setTenTacGias(List<String> tenTacGias) { this.tenTacGias = tenTacGias; }
    public List<String> getTenTheLoais() { return tenTheLoais; }
    public void setTenTheLoais(List<String> tenTheLoais) { this.tenTheLoais = tenTheLoais; }
    public String getTenNXB() { return tenNXB; }
    public void setTenNXB(String tenNXB) { this.tenNXB = tenNXB; }
    public String getTinhTrang() { return tinhTrang; }
    public void setTinhTrang(String tinhTrang) { this.tinhTrang = tinhTrang; }
    public Integer getGia() { return gia; }
    public void setGia(Integer gia) { this.gia = gia; }
    public int getSoLuong() { return soLuong; }
    public void setSoLuong(int soLuong) { this.soLuong = soLuong; }
    public List<String> getHinhAnh() { return hinhAnh; }
    public void setHinhAnh(List<String> hinhAnh) { this.hinhAnh = hinhAnh; }
    public String getChuThich() { return chuThich; }
    public void setChuThich(String chuThich) { this.chuThich = chuThich; }
    public Integer getTaiBan() { return taiBan; }
    public void setTaiBan(Integer taiBan) { this.taiBan = taiBan; }
    public Integer getNamXB() { return namXB; }
    public void setNamXB(Integer namXB) { this.namXB = namXB; }
}
