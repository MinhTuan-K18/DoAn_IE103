package com.library.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.library.demo.DTO.SachDTO; // Import class VietnameseNormalizer
import com.library.demo.model.IMGS;
import com.library.demo.model.Sach;
import com.library.demo.model.TacGia;
import com.library.demo.model.TheLoai;
import com.library.demo.repository.ImgRepository;
import com.library.demo.repository.SachRepository;
import com.library.demo.utils.VietnameseNormalizer;

@Service
public class SachService {

    

    @Autowired
    private GoogleBooksService googleBooksService;

    @Autowired
    private SachRepository sachRepository;

    @Autowired
    private ImgRepository imgRepository;

    public Page<SachDTO> searchBooks(String keyword, Pageable pageable) {
        String normalizedKeyword = VietnameseNormalizer.removeVietnameseAccents(keyword);
        Page<Sach> sachPage = sachRepository.searchBooks(normalizedKeyword, pageable);
        return sachPage.map(this::convertToDTO);
    }

    

    public Page<SachDTO> getAllBooks(Pageable pageable) {
        return sachRepository.findAll(pageable).map(this::convertToDTO);
    }

    private SachDTO convertToDTO(Sach sach) {
        SachDTO dto = new SachDTO();
        dto.setMaSach(sach.getMaSach());
        dto.setTenSach(sach.getTenSach());
        dto.setTenTacGias(sach.getTacGias().stream()
                .map(TacGia::getTenTG)
                .collect(Collectors.toList()));
        dto.setTenTheLoais(sach.getTheLoais().stream()
                .map(TheLoai::getTenTheLoai)
                .collect(Collectors.toList()));
        dto.setTenNXB(sach.getNxb().getTenNXB());
        dto.setTinhTrang(sach.getTinhTrang());
        dto.setGia(sach.getGia());
        dto.setSoLuong(sach.getSoLuong());

        List<String> hinhAnh = imgRepository.findByMaSach(sach.getMaSach())
                .stream()
                .map(IMGS::getImg)
                .collect(Collectors.toList());

        if (hinhAnh.isEmpty()) {
            String author = sach.getTacGias().isEmpty() ? "" : sach.getTacGias().get(0).getTenTG();
    String imageUrl = googleBooksService.getBookCoverUrl(sach.getTenSach(), author);
    if (imageUrl != null) {
        hinhAnh = new ArrayList<>(); // Đảm bảo có thể ghi thêm
        hinhAnh.add(imageUrl);

        IMGS img = new IMGS();
        img.setMaSach(sach.getMaSach());
        img.setImg(imageUrl);
        imgRepository.save(img);
            }
        }

        dto.setHinhAnh(hinhAnh);
        return dto;
    }
}
