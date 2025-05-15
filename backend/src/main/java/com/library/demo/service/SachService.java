package com.library.demo.service;

import com.library.demo.DTO.SachDTO;
import com.library.demo.model.*;
import com.library.demo.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SachService {
    @Autowired
    private SachRepository sachRepository;
    @Autowired
    private NXBRepository nxbRepository;
    @Autowired
    private TheLoaiRepository theLoaiRepository;
    @Autowired
    private TacGiaRepository tacGiaRepository;
    @Autowired
    private IMGSRepository imgsRepository;

    @Transactional
    public void themSach(SachDTO sachDTO) {
        // Validate DTO
        validateSachDTO(sachDTO);

        // Resolve or create NXB
        NXB nxb = nxbRepository.timKiemNXB(sachDTO.getTenNXB()).stream()
            .findFirst()
            .orElseGet(() -> {
                nxbRepository.themNXB(sachDTO.getTenNXB());
                return nxbRepository.timKiemNXB(sachDTO.getTenNXB()).stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Không thể tạo nhà xuất bản"));
            });

        // Call stored procedure to add book
        sachRepository.themSach(
            sachDTO.getTenSach(),
            sachDTO.getGia(),
            nxb.getMaNXB(),
            sachDTO.getNamXB(),
            sachDTO.getTaiBan(),
            sachDTO.getNgonNgu(),
            sachDTO.getSoLuong(),
            sachDTO.getChuThich(),
            sachDTO.getTinhTrang()
        );

        // Get the newly added book
        Sach sach = sachRepository.timKiemSach(sachDTO.getTenSach(), nxb.getMaNXB(), sachDTO.getNamXB(), sachDTO.getNgonNgu(), sachDTO.getTinhTrang())
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sách vừa thêm"));

        // Handle TheLoai
        List<TheLoai> theLoais = sachDTO.getTenTheLoais().stream()
            .map(tenTL -> theLoaiRepository.timKiemTheLoai(tenTL).stream()
                .findFirst()
                .orElseGet(() -> {
                    theLoaiRepository.themTheLoai(tenTL);
                    return theLoaiRepository.timKiemTheLoai(tenTL).stream()
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Không thể tạo thể loại"));
                }))
            .collect(Collectors.toList());
        sach.setTheLoais(theLoais);

        // Handle TacGia
        List<TacGia> tacGias = sachDTO.getTenTacGias().stream()
            .map(tenTG -> tacGiaRepository.timKiemTacGia(tenTG).stream()
                .findFirst()
                .orElseGet(() -> {
                    tacGiaRepository.themTacGia(tenTG);
                    return tacGiaRepository.timKiemTacGia(tenTG).stream()
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Không thể tạo tác giả"));
                }))
            .collect(Collectors.toList());
        sach.setTacGias(tacGias);

        // Handle IMGS
        if (sachDTO.getHinhAnhs() != null && !sachDTO.getHinhAnhs().isEmpty()) {
            List<IMGS> imgs = sachDTO.getHinhAnhs().stream()
                .map(url -> {
                    IMGS img = new IMGS();
                    img.setImg(url);
                    img.setSach(sach);
                    return img;
                })
                .collect(Collectors.toList());
            imgsRepository.saveAll(imgs);
        }

        sachRepository.save(sach);
    }

    @Transactional
    public void capNhatSach(Integer maSach, SachDTO sachDTO) {
        // Validate DTO
        validateSachDTO(sachDTO);

        // Check if book exists
        Sach sach = sachRepository.findById(maSach)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với mã: " + maSach));

        // Resolve or create NXB
        NXB nxb = nxbRepository.timKiemNXB(sachDTO.getTenNXB()).stream()
            .findFirst()
            .orElseGet(() -> {
                nxbRepository.themNXB(sachDTO.getTenNXB());
                return nxbRepository.timKiemNXB(sachDTO.getTenNXB()).stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Không thể tạo nhà xuất bản"));
            });

        // Call stored procedure to update book
        sachRepository.capNhatSach(
            maSach,
            sachDTO.getTenSach(),
            sachDTO.getGia(),
            nxb.getMaNXB(),
            sachDTO.getNamXB(),
            sachDTO.getTaiBan(),
            sachDTO.getNgonNgu(),
            sachDTO.getSoLuong(),
            sachDTO.getChuThich(),
            sachDTO.getTinhTrang()
        );

        // Update TheLoai
        List<TheLoai> theLoais = sachDTO.getTenTheLoais().stream()
            .map(tenTL -> theLoaiRepository.timKiemTheLoai(tenTL).stream()
                .findFirst()
                .orElseGet(() -> {
                    theLoaiRepository.themTheLoai(tenTL);
                    return theLoaiRepository.timKiemTheLoai(tenTL).stream()
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Không thể tạo thể loại"));
                }))
            .collect(Collectors.toList());
        sach.setTheLoais(theLoais);

        // Update TacGia
        List<TacGia> tacGias = sachDTO.getTenTacGias().stream()
            .map(tenTG -> tacGiaRepository.timKiemTacGia(tenTG).stream()
                .findFirst()
                .orElseGet(() -> {
                    tacGiaRepository.themTacGia(tenTG);
                    return tacGiaRepository.timKiemTacGia(tenTG).stream()
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Không thể tạo tác giả"));
                }))
            .collect(Collectors.toList());
        sach.setTacGias(tacGias);

        // Update IMGS
        imgsRepository.deleteBySach_MaSach(maSach);
        if (sachDTO.getHinhAnhs() != null && !sachDTO.getHinhAnhs().isEmpty()) {
            List<IMGS> imgs = sachDTO.getHinhAnhs().stream()
                .map(url -> {
                    IMGS img = new IMGS();
                    img.setImg(url);
                    img.setSach(sach);
                    return img;
                })
                .collect(Collectors.toList());
            imgsRepository.saveAll(imgs);
        }

        sachRepository.save(sach);
    }

    @Transactional
    public void xoaSach(Integer maSach) {
        if (!sachRepository.existsById(maSach)) {
            throw new RuntimeException("Không tìm thấy sách với mã: " + maSach);
        }
        imgsRepository.deleteBySach_MaSach(maSach);
        sachRepository.deleteById(maSach);
    }

    public List<SachDTO> timKiemSach(String tenSach, Integer maNXB, Integer namXB, String ngonNgu, String tinhTrang) {
        List<Sach> sachList = sachRepository.timKiemSach(tenSach, maNXB, namXB, ngonNgu, tinhTrang);
        return sachList.stream().map(this::toSachDTO).collect(Collectors.toList());
    }

    public Optional<SachDTO> getSachById(Integer maSach) {
        return sachRepository.findById(maSach).map(this::toSachDTO);
    }

    private SachDTO toSachDTO(Sach sach) {
        SachDTO dto = new SachDTO();
        dto.setMaSach(sach.getMaSach());
        dto.setTenSach(sach.getTenSach());
        dto.setGia(sach.getGia());
        dto.setNamXB(sach.getNamXB());
        dto.setTaiBan(sach.getTaiBan());
        dto.setNgonNgu(sach.getNgonNgu());
        dto.setSoLuong(sach.getSoLuong());
        dto.setChuThich(sach.getChuThich());
        dto.setTinhTrang(sach.getTinhTrang());
        dto.setTenNXB(sach.getNxb() != null ? sach.getNxb().getTenNXB() : null);
        dto.setTenTheLoais(sach.getTheLoais().stream().map(TheLoai::getTenTheLoai).collect(Collectors.toList()));
        dto.setTenTacGias(sach.getTacGias().stream().map(TacGia::getTenTG).collect(Collectors.toList()));
        dto.setHinhAnhs(imgsRepository.findBySach_MaSach(sach.getMaSach()).stream()
            .map(IMGS::getImg).collect(Collectors.toList()));
        return dto;
    }

    private void validateSachDTO(SachDTO sachDTO) {
        if (sachDTO.getTenNXB() == null || sachDTO.getTenNXB().isEmpty()) {
            throw new IllegalArgumentException("Tên nhà xuất bản không được để trống");
        }
        if (sachDTO.getTenTheLoais() == null || sachDTO.getTenTheLoais().isEmpty()) {
            throw new IllegalArgumentException("Phải có ít nhất một thể loại");
        }
        if (sachDTO.getTenTacGias() == null || sachDTO.getTenTacGias().isEmpty()) {
            throw new IllegalArgumentException("Phải có ít nhất một tác giả");
        }
    }
}