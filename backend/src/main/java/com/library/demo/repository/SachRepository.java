package com.library.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;

import com.library.demo.model.Sach;


public interface SachRepository extends JpaRepository<Sach, Integer> {
    @Query("SELECT s FROM Sach s " +
           "JOIN s.theLoais tl " +
           "JOIN s.tacGias tg " +
           "JOIN s.nxb nxb " +  
           "WHERE (:keyword IS NULL OR " +
           "LOWER(s.tenSach) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(tl.tenTheLoai) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(tg.tenTG) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(nxb.tenNXB) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Sach> searchBooks(@Param("keyword") String keyword, Pageable pageable);
    Sach findBymaSach(Integer maSach);
//   @Modifying
//     @Query("DELETE FROM TACGIA_SACH ts WHERE ts.MASACH = :maSach")
//     void deleteTacGiaSachByMaSach(@Param("maSach") Integer maSach);

//     @Modifying
//     @Query("DELETE FROM THELOAI_SACH ts WHERE ts.MASACH = :maSach")
//     void deleteTheLoaiSachByMaSach(@Param("maSach") Integer maSach);
}