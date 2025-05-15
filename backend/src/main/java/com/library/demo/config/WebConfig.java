// package com.library.demo.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {

//     @Override
//     public void addCorsMappings(CorsRegistry registry) {
//         registry.addMapping("/**")
//                 .allowedOrigins("http://localhost:3000") // Chấp nhận yêu cầu từ http://localhost:3000
//                 .allowedMethods("GET", "POST", "PUT", "DELETE") // Các phương thức HTTP cho phép
//                 .allowedHeaders("*") // Cho phép tất cả các header
//                 .allowCredentials(true); // Cho phép cookies và credentials
//     }
// }
