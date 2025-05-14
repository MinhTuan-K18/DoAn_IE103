package com.library_web.library.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "book")
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maSach;             
    private String tenSach;
    @Column(length = 10000)
    private String moTa;
    private String tenTacGia;
    private String nxb;
    private Integer nam;
    private Integer trongLuong;
    private Integer donGia;
    private Integer tongSoLuong = 0;
    private Integer soLuongMuon = 0;
    private Integer soLuongXoa = 0;

    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;

    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    @ElementCollection
    @JsonIgnore  
    private List<String> hinhAnh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_child_id")
    private CategoryChild categoryChild;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookChild> children = new ArrayList<>();

    public enum TrangThai {
        CON_SAN("Còn sẵn"),
        DA_XOA("Đã xóa"),
        DA_HET("Đã hết"); 

        private final String moTa;
        TrangThai(String moTa) { 
            this.moTa = moTa; 
        }
        public String getMoTa() {
             return moTa; 
        }

        public static TrangThai fromString(String name) {
            try {
                return TrangThai.valueOf(name.toUpperCase()); 
            }
            catch (IllegalArgumentException e) {
                 throw new IllegalArgumentException("Trạng thái không hợp lệ: " + name); 
            }
        }
    }

    public Book() {
        this.trangThai = TrangThai.CON_SAN;
        this.createdAt = LocalDate.now(); // Khởi tạo createdAt
    }

    // Getters & setters
    public Long getMaSach() {
         return maSach; 
    }
    public void setMaSach(Long maSach) {
         this.maSach = maSach; 
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
    public TrangThai getTrangThai() {
         return trangThai; 
    }
    public void setTrangThai(TrangThai trangThai) {
         this.trangThai = trangThai; 
    }
    public LocalDate getCreatedAt() {
         return createdAt; 
    }

    public List<String> getHinhAnh() {
         return hinhAnh; 
    }
    public void setHinhAnh(List<String> hinhAnh) {
         this.hinhAnh = hinhAnh; 
    }
    public CategoryChild getCategoryChild() {
         return categoryChild; 
    }
    public void setCategoryChild(CategoryChild categoryChild) {
        this.categoryChild = categoryChild; 
    }
    public List<BookChild> getChildren() {
         return children; 
    }
    public void setChildren(List<BookChild> children) {
         this.children = children; 
    }
    
    public void addChild(BookChild c) {
        if (!children.contains(c)) {
            children.add(c);
            c.setBook(this);
            tongSoLuong++;
        }
    }

    public void decreaseTotalQuantity() {
        if (tongSoLuong > 0) {
            tongSoLuong--;
        }
    }

    public void onBorrow() {
        if (tongSoLuong - getCurrentBorrowedCount() < 0) {
            throw new IllegalStateException("Hết sách để mượn");
        }
        soLuongMuon++;
    }

    public int getCurrentBorrowedCount() {
        return (int) children.stream().filter(c -> c.getStatus() == BookChild.Status.BORROWED).count();
    }

    public void onReturn() {
        if (soLuongMuon <= 0) throw new IllegalStateException("Không có sách nào đang mượn");
    }

    public void updateTrangThai() {
        List<BookChild> children = this.getChildren();
        
        long availableCount = children.stream().filter(c -> c.getStatus() == BookChild.Status.AVAILABLE).count();
        long borrowedCount = children.stream().filter(c -> c.getStatus() == BookChild.Status.BORROWED).count();
        long notAvailableCount = children.stream().filter(c -> c.getStatus() == BookChild.Status.NOT_AVAILABLE).count();
        
        if (availableCount > 0) {
            this.trangThai = TrangThai.CON_SAN;
        } else if (borrowedCount > 0) {
            this.trangThai = TrangThai.DA_HET;
        } else if (notAvailableCount == children.size()) {
            this.trangThai = TrangThai.DA_XOA;
        }
    }

    
}
