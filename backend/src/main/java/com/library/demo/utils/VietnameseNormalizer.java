package com.library.demo.utils;

import java.text.Normalizer;

public class VietnameseNormalizer {

    // Phương thức chuẩn hóa dữ liệu (loại bỏ dấu tiếng Việt)
    public static String removeVietnameseAccents(String input) {
        if (input == null) return null;
        
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return normalized.replaceAll("[^\\p{ASCII}]", ""); // Loại bỏ tất cả các ký tự không phải ASCII (dấu tiếng Việt)
    }
}
