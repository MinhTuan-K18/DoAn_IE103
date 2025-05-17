package com.library.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.library.demo.DTO.SachDTO;
import com.library.demo.model.IMGS;
import com.library.demo.model.NXB;
import com.library.demo.model.Sach;
import com.library.demo.model.TacGia;
import com.library.demo.model.TheLoai;
import com.library.demo.repository.ImgRepository;
import com.library.demo.repository.NXBRepository;
import com.library.demo.repository.SachRepository;
import com.library.demo.repository.TheLoaiRepository;
import com.library.demo.repository.tacGiaRepository;
import com.library.demo.utils.VietnameseNormalizer;

@Service
public class SachService {

    @Autowired
    private GoogleBooksService googleBooksService;

    @Autowired
    private SachRepository sachRepository;

    @Autowired
    private ImgRepository imgRepository;

    @Autowired
    private tacGiaRepository tacGiaRepository;

    @Autowired
    private TheLoaiRepository theLoaiRepository;

    @Autowired
    private NXBRepository nxbRepository;

    public Page<SachDTO> searchBooks(String keyword, Pageable pageable) {
        String normalizedKeyword = VietnameseNormalizer.removeVietnameseAccents(keyword);
        Page<Sach> sachPage = sachRepository.searchBooks(normalizedKeyword, pageable);
        return sachPage.map(this::convertToDTO);
    }

    public Page<SachDTO> getAllBooks(Pageable pageable) {
        return sachRepository.findAll(pageable).map(this::convertToDTO);
    }

    public SachDTO saveBook(SachDTO sachDTO) {
        Sach sach = new Sach();
        updateSachFromDTO(sach, sachDTO);
        Sach savedSach = sachRepository.save(sach);
        if (sachDTO.getHinhAnh() != null && !sachDTO.getHinhAnh().isEmpty()) {
            for (String imgUrl : sachDTO.getHinhAnh()) {
                IMGS img = new IMGS();
                img.setMaSach(savedSach.getMaSach());
                img.setImg(imgUrl);
                imgRepository.save(img);
            }
        }
        return convertToDTO(savedSach);
    }

    public SachDTO updateBook(Integer maSach, SachDTO sachDTO) {
        Sach sach = sachRepository.findBymaSach(maSach);
        if (sach == null) {
            throw new IllegalArgumentException("Sách không tồn tại với mã: " + maSach);
        }
        updateSachFromDTO(sach, sachDTO);
        Sach updatedSach = sachRepository.save(sach);
        return convertToDTO(updatedSach);
    }

    public SachDTO getSachById(Integer maSach) {
        Sach sach = sachRepository.findBymaSach(maSach);
        if (sach == null) {
            throw new IllegalArgumentException("Không tìm thấy sách với mã: " + maSach);
        }
        return convertToDTO(sach);
    }

    public void deleteBook(Integer maSach) {
        Sach sach = sachRepository.findBymaSach(maSach);
        if (sach == null) {
            throw new IllegalArgumentException("Sách không tồn tại với mã: " + maSach);
        }
        try {
            // sachRepository.deleteTacGiaSachByMaSach(maSach);
            // sachRepository.deleteTheLoaiSachByMaSach(maSach);
            imgRepository.deleteById(maSach);
            sachRepository.deleteById(maSach);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa sách: " + e.getMessage());
        }
    }

    private void updateSachFromDTO(Sach sach, SachDTO sachDTO) {
        sach.setTenSach(sachDTO.getTenSach());
        sach.setGia(sachDTO.getGia());
        sach.setSoLuong(sachDTO.getSoLuong());
        sach.setTinhTrang(sachDTO.getTinhTrang());
        sach.setNamXB(sachDTO.getNamXB());
        sach.setChuThich(sachDTO.getChuThich());
        sach.setTaiBan(sachDTO.getTaiBan());

        List<TacGia> tacGias = new ArrayList<>();
        for (String tenTG : sachDTO.getTenTacGias()) {
            TacGia tacGia = tacGiaRepository.findByTenTG(tenTG)
                    .orElseGet(() -> {
                        TacGia newTacGia = new TacGia();
                        newTacGia.setTenTG(tenTG);
                        return tacGiaRepository.save(newTacGia);
                    });
            tacGias.add(tacGia);
        }
        sach.setTacGias(tacGias);

        List<TheLoai> theLoais = new ArrayList<>();
        for (String tenTheLoai : sachDTO.getTenTheLoais()) {
            TheLoai theLoai = theLoaiRepository.findByTenTheLoai(tenTheLoai)
                    .orElseGet(() -> {
                        TheLoai newTheLoai = new TheLoai();
                        newTheLoai.setTenTheLoai(tenTheLoai);
                        return theLoaiRepository.save(newTheLoai);
                    });
            theLoais.add(theLoai);
        }
        sach.setTheLoais(theLoais);

        NXB nxb = nxbRepository.findByTenNXB(sachDTO.getTenNXB())
                .orElseGet(() -> {
                    NXB newNXB = new NXB();
                    newNXB.setTenNXB(sachDTO.getTenNXB());
                    return nxbRepository.save(newNXB);
                });
        sach.setNxb(nxb);
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
        dto.setNamXB(sach.getNamXB());
        dto.setChuThich(sach.getChuThich());
        dto.setTaiBan(sach.getTaiBan());

        List<String> hinhAnh = imgRepository.findByMaSach(sach.getMaSach())
                .stream()
                .map(IMGS::getImg)
                .collect(Collectors.toList());

        if (hinhAnh.isEmpty()) {
            String author = sach.getTacGias().isEmpty() ? "" : sach.getTacGias().get(0).getTenTG();
            String imageUrl = googleBooksService.getBookCoverUrl(sach.getTenSach(), author);
            if (imageUrl != null) {
                hinhAnh = new ArrayList<>();
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