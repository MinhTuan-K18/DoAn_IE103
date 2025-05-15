package com.library.demo.repository;

import com.library.demo.model.TheLoai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TheLoaiRepository extends JpaRepository<TheLoai, Integer> {
    @Procedure(name = "sp_ThemTheLoai")
    void themTheLoai(@Param("p_TenTheLoai") String tenTheLoai);

    @Procedure(name = "sp_CapNhatTheLoai")
    void capNhatTheLoai(@Param("p_MaTL") Integer maTL, @Param("p_TenTheLoai") String tenTheLoai);

    @Procedure(name = "sp_TimKiemTheLoai")
    List<TheLoai> timKiemTheLoai(@Param("p_TenTheLoai") String tenTheLoai);
}