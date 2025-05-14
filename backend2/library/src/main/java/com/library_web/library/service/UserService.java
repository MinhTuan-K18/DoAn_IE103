package com.library_web.library.service;

import com.library_web.library.dto.UserDTO;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.security.JwtUtil;
import com.library_web.library.service.TempStorage.PendingUser;

import org.apache.coyote.BadRequestException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã OTP xác thực");
        message.setText("Mã OTP của bạn là: " + otp + ". Mã hết hạn sau 5 phút.");
        mailSender.send(message);
    }

    public Map<String, String> register(UserDTO userDTO) {
        // if (userDTO.getUsername() == null || userDTO.getUsername().isBlank())
        // throw new IllegalArgumentException("Username không được để trống");
        // if (userDTO.getPassword() == null || userDTO.getPassword().isBlank())
        // throw new IllegalArgumentException("Password không được để trống");
        // if (userDTO.getPassword().length() < 6)
        // throw new IllegalArgumentException("Password phải có ít nhất 6 ký tự");
        // if (userDTO.getBirthdate() == null || userDTO.getBirthdate().isBlank())
        // throw new IllegalArgumentException("Ngày sinh không được để trống");
        // if (userDTO.getGender() == null || userDTO.getGender().isBlank())
        // throw new IllegalArgumentException("Giới tính không được để trống");

        // if ((userDTO.getEmail() == null || userDTO.getEmail().isBlank()) &&
        //         (userDTO.getPhone() == null || userDTO.getPhone().isBlank())) {
        //     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phải cung cấp email hoặc số điện thoại");
        // }
        // if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()
        //         && userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
        //     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
        // }
        // if (userDTO.getPhone() != null && !userDTO.getPhone().isBlank()
        //         && userRepository.findByPhone(userDTO.getPhone()).isPresent()) {
        //     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại đã tồn tại");
        // }
        // if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
        //     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên đăng nhập đã tồn tại");
        //}

        if (userDTO.getEmail() != null && userRepository.findByEmail(userDTO.getEmail()).isPresent())
            throw new IllegalArgumentException("Email đã tồn tại");
        if (userDTO.getPhone() != null && userRepository.findByPhone(userDTO.getPhone()).isPresent())
            throw new IllegalArgumentException("Số điện thoại đã tồn tại");
        
        if (userDTO.getPhone() != null && (userDTO.getEmail() == null || userDTO.getEmail().isBlank())) {
            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setPhone(userDTO.getPhone());
            user.setEmail("unknown");
            user.setGender(userDTO.getGender());
            user.setBirthdate(userDTO.getBirthdate());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            user.setRole(userDTO.getRole() != null ? userDTO.getRole() : "USER");

            userRepository.save(user);
            return Map.of("message", "Đăng ký thành công bằng số điện thoại");
        }

        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);
        TempStorage.savePendingUser(userDTO, otp, expiredAt);

        sendOtpEmail(userDTO.getEmail(), otp);
        return Map.of("message", "Đã gửi OTP tới email, vui lòng xác thực");
    }

    public Map<String, Object> verifyOtpAndCreate(String email, String otp) {
        PendingUser pending = TempStorage.getPendingUser(email);
        if (pending == null || !pending.getOtp().equals(otp) || LocalDateTime.now().isAfter(pending.getExpiredAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP không chính xác hoặc đã hết hạn");
        }

        User user = new User();
        user.setUsername(pending.getUserDTO().getUsername());
        user.setEmail(pending.getUserDTO().getEmail());
        user.setGender(pending.getUserDTO().getGender());
        user.setBirthdate(pending.getUserDTO().getBirthdate());
        user.setPassword(passwordEncoder.encode(pending.getUserDTO().getPassword()));
        user.setRole(pending.getUserDTO().getRole() != null ? pending.getUserDTO().getRole() : "USER");
        userRepository.save(user);
        TempStorage.removePendingUser(email);

        return Map.of(
                "message", "Đăng ký thành công bằng email"

        );
    }

    public Map<String, Object> login(String emailOrPhone, String password) {
        if (emailOrPhone == null || emailOrPhone.isBlank() || password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Email hoặc số điện thoại và mật khẩu không được để trống");
        }

        Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(emailOrPhone);
        }
        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email hoặc số điện thoại không tồn tại");
        }
        if (!passwordEncoder.matches(password, userOpt.get().getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu không đúng");
        }

        User user = userOpt.get();
        String accessToken = JwtUtil.generateAccessToken(user.getUsername());
        String refreshToken = JwtUtil.generateRefreshToken(user.getUsername());

        return Map.of(
                "message", "Đăng nhập thành công",
                "data", Map.of(
                        "accessToken", accessToken,
                        "refreshToken", refreshToken,
                        "user", Map.of(
                                "username", user.getUsername(),
                                "email", user.getEmail() != null ? user.getEmail() : "",
                                "phone", user.getPhone() != null ? user.getPhone() : "",
                                "fullname", user.getFullname() != null ? user.getFullname() : "",
                                "role", user.getRole() != null ? user.getRole() : ""
                                )));

    }

    public Map<String, Object> refreshAccessToken(String refreshToken) {
        String username = JwtUtil.validateToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Refresh Token không hợp lệ hoặc đã hết hạn"));
        String newAccessToken = JwtUtil.generateAccessToken(user.getUsername());
        return Map.of(
                "message", "Làm mới access token thành công",
                "data", Map.of("accessToken", newAccessToken));
    }

    public Map<String, Object> forgotPassword(String emailOrPhone) {
        if (emailOrPhone == null || emailOrPhone.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email hoặc số điện thoại không được để trống");
        }

        Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(emailOrPhone);
        }
        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Không tìm thấy người dùng với email hoặc số điện thoại này");
        }

        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        TempStorage.savePendingOtp(emailOrPhone, otp, LocalDateTime.now().plusMinutes(5));

        if (emailOrPhone.contains("@")) {
            sendOtpEmail(emailOrPhone, otp);
        } else {
            System.out.println("Gửi SMS tới số " + emailOrPhone + ": Mã OTP của bạn là " + otp);
        }

        return Map.of(
                "message", "Đã gửi OTP để đặt lại mật khẩu",
                "data", Map.of("emailOrPhone", emailOrPhone));
    }

    public Map<String, Object> resetPassword(String emailOrPhone, String otp, String newPassword) {
        if (emailOrPhone == null || emailOrPhone.isBlank() || otp == null || otp.isBlank() || newPassword == null
                || newPassword.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Email/số điện thoại, OTP và mật khẩu mới không được để trống");
        }
        if (newPassword.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu mới phải có ít nhất 6 ký tự");
        }
        if (!TempStorage.isValidOtp(emailOrPhone, otp)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP không chính xác hoặc đã hết hạn");
        }

        Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(emailOrPhone);
        }
        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Không tìm thấy người dùng với email hoặc số điện thoại này");
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        TempStorage.removeOtp(emailOrPhone);

        return Map.of(
                "message", "Đặt lại mật khẩu thành công",
                "data", Map.of("username", user.getUsername()));

    }

    public Map<String, Object> loginWithGoogle(String idToken) {
        String email = getEmailFromGoogleIdToken(idToken);
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IdToken không hợp lệ");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isEmpty()) {
            user = new User();
            user.setUsername(email.split("@")[0]);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("google_" + email));
            user.setRole("USER");
            userRepository.save(user);
        } else {
            user = userOpt.get();
        }

        String accessToken = JwtUtil.generateAccessToken(user.getUsername());
        String refreshToken = JwtUtil.generateRefreshToken(user.getUsername());

        return Map.of(
                "message", "Đăng nhập bằng Google thành công",
                "data", Map.of(
                        "accessToken", accessToken,
                        "refreshToken", refreshToken,
                        "user", Map.of(
                                "username", user.getUsername(),
                                "email", user.getEmail() != null ? user.getEmail() : "",
                                "phone", user.getPhone() != null ? user.getPhone() : "",
                                "fullname", user.getFullname() != null ? user.getFullname() : "")));
    }

    public String getEmailFromGoogleIdToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections
                            .singletonList("376530680599-mlb7pbrp0inmjnfqmit5q6v4a38e6t09.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idTokenObj = verifier.verify(idToken);
            if (idTokenObj != null) {
                GoogleIdToken.Payload payload = idTokenObj.getPayload();
                return payload.getEmail();
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IdToken không hợp lệ");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lỗi xác thực idToken: " + e.getMessage());
        }
    }
}