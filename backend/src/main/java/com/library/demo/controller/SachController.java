package com.library.demo.controller;

import com.library.demo.DTO.SachDTO;
import com.library.demo.service.SachService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sach")
public class SachController {
    @Autowired
    private SachService sachService;

    @PostMapping
    public ResponseEntity<String> themSach(@Valid @RequestBody SachDTO sachDTO) {
        sachService.themSach(sachDTO);
        return ResponseEntity.ok("Thêm sách thành công");
    }

    @PutMapping("/{maSach}")
    public ResponseEntity<String> capNhatSach(@PathVariable Integer maSach, @Valid @RequestBody SachDTO sachDTO) {
        sachService.capNhatSach(maSach, sachDTO);
        return ResponseEntity.ok("Cập nhật sách thành công");
    }

    @DeleteMapping("/{maSach}")
    public ResponseEntity<String> xoaSach(@PathVariable Integer maSach) {
        sachService.xoaSach(maSach);
        return ResponseEntity.ok("Xóa sách thành công");
    }

    @GetMapping
    public ResponseEntity<List<SachDTO>> timKiemSach(
        @RequestParam(required = false) String tenSach,
        @RequestParam(required = false) Integer maNXB,
        @RequestParam(required = false) Integer namXB,
        @RequestParam(required = false) String ngonNgu,
        @RequestParam(required = false) String tinhTrang
    ) {
        List<SachDTO> sachList = sachService.timKiemSach(tenSach, maNXB, namXB, ngonNgu, tinhTrang);
        return ResponseEntity.ok(sachList);
    }

    @GetMapping("/{maSach}")
    public ResponseEntity<SachDTO> getSachById(@PathVariable Integer maSach) {
        return sachService.getSachById(maSach)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}