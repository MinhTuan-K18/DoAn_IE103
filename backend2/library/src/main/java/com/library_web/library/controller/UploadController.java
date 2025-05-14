package com.library_web.library.controller;

import com.library_web.library.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

  @Autowired
  private UploadService uploadService;

  @PostMapping("/image")
  public ResponseEntity<?> uploadImages(@RequestParam("file") MultipartFile[] files) {
    return uploadService.uploadImages(files);
  }
}