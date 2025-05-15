package com.library.demo.repository;

import com.library.demo.model.TacGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TacGiaRepository extends JpaRepository<TacGia, Integer> {
    @Procedure(name = "sp_ThemTacGia")
    void themTacGia(@Param("p_TenTG") String tenTG);

    @Procedure(name = "sp_CapNhatTacGia")
    void capNhatTacGia(@Param("p_MaTG") Integer maTG, @Param("p_TenTG") String tenTG);

    @Procedure(name = "sp_TimKiemTacGia")
    List<TacGia> timKiemTacGia(@Param("p_TenTG") String tenTG);
}