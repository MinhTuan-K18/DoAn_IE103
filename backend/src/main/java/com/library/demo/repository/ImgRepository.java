package com.library.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;

import com.library.demo.model.IMGS;

public interface ImgRepository extends JpaRepository<IMGS, Integer> {
    @Query("SELECT i FROM IMGS i WHERE i.maSach = :maSach")
    List<IMGS> findByMaSach(@Param("maSach") int maSach);
    @Modifying
    @Query("DELETE FROM IMGS i WHERE i.maSach = :maSach")
    void deleteById(@Param("maSach") Integer maSach);
}
