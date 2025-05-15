package com.library.demo.repository;

import com.library.demo.model.Sach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SachRepository extends JpaRepository<Sach, Integer> {
    @Procedure(name = "sp_ThemSach")
    void themSach(
        @Param("p_TenSach") String tenSach,
        @Param("p_Gia") Integer gia,
        @Param("p_MaNXB") Integer maNXB,
        @Param("p_NamXB") Integer namXB,
        @Param("p_TaiBan") Integer taiBan,
        @Param("p_NgonNgu") String ngonNgu,
        @Param("p_SoLuong") Integer soLuong,
        @Param("p_ChuThich") String chuThich,
        @Param("p_TinhTrang") String tinhTrang
    );

    @Procedure(name = "sp_CapNhatSach")
    void capNhatSach(
        @Param("p_MaSach") Integer maSach,
        @Param("p_TenSach") String tenSach,
        @Param("p_Gia") Integer gia,
        @Param("p_MaNXB") Integer maNXB,
        @Param("p_NamXB") Integer namXB,
        @Param("p_TaiBan") Integer taiBan,
        @Param("p_NgonNgu") String ngonNgu,
        @Param("p_SoLuong") Integer soLuong,
        @Param("p_ChuThich") String chuThich,
        @Param("p_TinhTrang") String tinhTrang
    );

    @Procedure(name = "sp_TimKiemSach")
    List<Sach> timKiemSach(
        @Param("p_TenSach") String tenSach,
        @Param("p_MaNXB") Integer maNXB,
        @Param("p_NamXB") Integer namXB,
        @Param("p_NgonNgu") String ngonNgu,
        @Param("p_TinhTrang") String tinhTrang
    );
}