package com.library.demo.repository;

import com.library.demo.model.NXB;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NXBRepository extends JpaRepository<NXB, Integer> {
    @Procedure(name = "sp_ThemNXB")
    void themNXB(@Param("p_TenNXB") String tenNXB);

    @Procedure(name = "sp_CapNhatNXB")
    void capNhatNXB(@Param("p_MaNXB") Integer maNXB, @Param("p_TenNXB") String tenNXB);

    @Procedure(name = "sp_TimKiemNXB")
    List<NXB> timKiemNXB(@Param("p_TenNXB") String tenNXB);
}