package com.library.demo.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class SachDTO {
    private Integer maSach;

    @NotBlank(message = "Tên sách không được để trống")
    private String tenSach;

    @Min(value = 0, message = "Giá phải lớn hơn hoặc bằng 0")
    private Integer gia;

    @Min(value = 1900, message = "Năm xuất bản phải từ 1900 trở lên")
    private Integer namXB;

    @Min(value = 0, message = "Tái bản phải lớn hơn hoặc bằng 0")
    private Integer taiBan;

    @Size(max = 20, message = "Ngôn ngữ không được vượt quá 20 ký tự")
    private String ngonNgu;

    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
    private Integer soLuong;

    private String chuThich;

    @Pattern(regexp = "Hết sách|Thiếu sách|Đầy đủ sách", message = "Tình trạng không hợp lệ")
    private String tinhTrang;

    @NotBlank(message = "Tên nhà xuất bản không được để trống")
    private String tenNXB;

    @Min(value = 1, message = "Mã nhà xuất bản phải hợp lệ")
private Integer maNXB;

    @NotEmpty(message = "Phải có ít nhất một thể loại")
    private List<String> tenTheLoais;

    @NotEmpty(message = "Phải có ít nhất một tác giả")
    private List<String> tenTacGias;

    private List<String> hinhAnhs;
}