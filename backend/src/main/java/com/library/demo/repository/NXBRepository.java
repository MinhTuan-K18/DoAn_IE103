package com.library.demo.repository;

import com.library.demo.model.NXB;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NXBRepository extends JpaRepository<NXB, Long> {
    Optional<NXB> findByTenNXB(String tenNXB);
}