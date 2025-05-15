package com.library.demo.repository;

import com.library.demo.model.IMGS;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IMGSRepository extends JpaRepository<IMGS, Integer> {
    List<IMGS> findBySach_MaSach(Integer maSach);
    void deleteBySach_MaSach(Integer maSach);
}