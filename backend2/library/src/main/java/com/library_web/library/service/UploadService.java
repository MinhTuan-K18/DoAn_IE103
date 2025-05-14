package com.library_web.library.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.util.*;

@Service
public class UploadService {

  @Autowired
  private Cloudinary cloudinary;

  public ResponseEntity<?> uploadImages(MultipartFile[] files) {
    try {
      List<String> urls = new ArrayList<>();

      for (MultipartFile file : files) {
        System.out.println("==> Received:");
        System.out.println("Name: " + file.getOriginalFilename());
        System.out.println("Size: " + file.getSize() + " bytes");

        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader()
            .upload(file.getBytes(), ObjectUtils.emptyMap());

        urls.add((String) uploadResult.get("secure_url"));
      }

      return ResponseEntity.ok(urls);
    } catch (IOException e) {
      return ResponseEntity.badRequest().body(Map.of("error", "Lỗi upload ảnh: " + e.getMessage()));
    }
  }
}