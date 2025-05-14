package com.library_web.library.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cho phép mọi domain (hoặc có thể thay bằng URL cụ thể như http://localhost:3000)
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")  // Cập nhật URL frontend của bạn
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // Các phương thức được phép
                .allowedHeaders("*") // Cho phép tất cả header
                .allowCredentials(true); // Cho phép gửi cookie nếu cần
                
    }
    
}