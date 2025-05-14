package com.library_web.library.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

  @Value("${cloudinary.cloud_name}")
  private String cloudName;

  @Value("${cloudinary.api_key}")
  private String apiKey;

  @Value("${cloudinary.api_secret}")
  private String apiSecret;

  @Bean
  public Cloudinary cloudinary() {
    Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
        "cloud_name", cloudName,
        "api_key", apiKey,
        "api_secret", apiSecret,
        "secure", true));

    // Kiểm tra kết nối
    try {
      @SuppressWarnings("unchecked")
      Map<String, Object> result = cloudinary.api().usage(ObjectUtils.emptyMap());
      System.out.println("Cloudinary has been successfully connected. Usage info: " + result.get("plan"));
    } catch (Exception e) {
      System.err.println("Cloudinary has failed to connect: " + e.getMessage());
    }

    return cloudinary;
  }
}