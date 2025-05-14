package com.library_web.library.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.library_web.library.service.TokenService;

import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenService tokenService;

    public JwtAuthenticationFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {

    String token = request.getHeader("Authorization");


    if (token != null && token.startsWith("Bearer ")) {
        token = token.substring(7);
        if (tokenService.validateToken(token)) {
            String username = tokenService.getUsernameFromToken(token);
            if (username != null) {
                var auth = new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
    }

    // BẮT BUỘC phải gọi tiếp chain
    chain.doFilter(request, response);
}


}

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;
// import java.util.List;

// public class JwtAuthenticationFilter extends OncePerRequestFilter {

//     @Autowired
//     private UserRepository userRepository; // Cần load User từ DB

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//                                     HttpServletResponse response,
//                                     FilterChain filterChain) throws ServletException, IOException {
//         String authHeader = request.getHeader("Authorization");
    
//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             String token = authHeader.substring(7);
//             try {
//                 Claims claims = JwtUtil.parseClaims(token);
    
//                 if (claims != null) {
//                     String username = claims.getSubject();
//                     String role = claims.get("role", String.class); // lấy role trong payload token
    
//                     UsernamePasswordAuthenticationToken authenticationToken =
//                             new UsernamePasswordAuthenticationToken(
//                                     username,
//                                     null,
//                                     List.of(new SimpleGrantedAuthority(role)) // set đúng quyền
//                             );
//                     authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    
//                     SecurityContextHolder.getContext().setAuthentication(authenticationToken);
//                 }
//             } catch (Exception e) {
//                 // Token lỗi thì bỏ qua, để SecurityConfig chặn Unauthorized
//             }
//         }
    
//         filterChain.doFilter(request, response);
//     }
    
// }
