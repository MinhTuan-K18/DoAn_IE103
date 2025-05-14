package com.library_web.library.controller;

import com.library_web.library.dto.UserDTO;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.service.TempStorage;
import com.library_web.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/")
    public Map<String, Object> updateProfile(@RequestParam String username, @RequestBody Map<String, String> updates) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        String currentRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .iterator().next().getAuthority();

        if (currentRole.equals("USER") && !currentUsername.equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền sửa thông tin người khác");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với username: " + username));

        if (updates.containsKey("username")) {
            String newUsername = updates.get("username");
            if (newUsername == null || newUsername.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên đăng nhập không được để trống");
            }
            if (userRepository.findByUsername(newUsername).isPresent() && !newUsername.equals(user.getUsername())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên đăng nhập đã tồn tại");
            }
            user.setUsername(newUsername);
        }

        if (updates.containsKey("fullname")) {
            String fullname = updates.get("fullname");
            if (fullname != null && fullname.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Họ tên không được để trống");
            }
            user.setFullname(fullname);
        }

        if (updates.containsKey("phone")) {
            String newPhone = updates.get("phone");
            if (newPhone == null || newPhone.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại không được để trống");
            }
            if (!newPhone.matches("^\\d{10,11}$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại không đúng định dạng (10-11 chữ số)");
            }
            if (userRepository.findByPhone(newPhone).isPresent() && !newPhone.equals(user.getPhone())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại đã tồn tại");
            }
            user.setPhone(newPhone);
        }

        if (updates.containsKey("email")) {
            String newEmail = updates.get("email");
            if (newEmail == null || newEmail.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email không được để trống");
            }
            if (!newEmail.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email không đúng định dạng");
            }
            if (userRepository.findByEmail(newEmail).isPresent() && !newEmail.equals(user.getEmail())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
            }

            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
            LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);

            UserDTO dto = new UserDTO();
            dto.setUsername(user.getUsername());
            dto.setEmail(newEmail);

            TempStorage.savePendingUser(dto, otp, expiredAt);
            userService.sendOtpEmail(newEmail, otp);

            return Map.of(
                "message", "Đã gửi OTP tới email mới, vui lòng xác thực để hoàn tất cập nhật"
            );
        }

        if (updates.containsKey("password")) {
            String newPassword = updates.get("password");
            if (newPassword == null || newPassword.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu không được để trống");
            }
            if (newPassword.length() < 6) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu phải có ít nhất 6 ký tự");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);

        return Map.of(
            "message", "Cập nhật thông tin thành công",
            "data", Map.of(
                "username", user.getUsername(),
                "fullname", user.getFullname() != null ? user.getFullname() : "",
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "email", user.getEmail() != null ? user.getEmail() : ""
            )
        );
    }

    @PostMapping("/verify-email-update")
    public Map<String, Object> verifyEmailUpdate(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        if (email == null || email.isBlank() || otp == null || otp.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email và OTP không được để trống");
        }

        var pending = TempStorage.getPendingUser(email);
        if (pending == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có yêu cầu xác thực nào với email này");
        }

        if (!pending.getOtp().equals(otp)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP không chính xác");
        }

        if (LocalDateTime.now().isAfter(pending.getExpiredAt())) {
            TempStorage.removePendingUser(email);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP đã hết hạn");
        }


      {/*<<<<<<< thuytrang
        // Xác thực đúng → cập nhật email
        String currentUsername = ((UserDTO) pending.getUserDTO()).getUsername(); // Lấy username từ TempStorage
=======*/}
        String currentUsername = pending.getUserDTO().getUsername();


        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với username: " + currentUsername));

        user.setEmail(email);
        userRepository.save(user);
        TempStorage.removePendingUser(email);

        return Map.of(
            "message", "Xác thực email thành công, thông tin đã được cập nhật",
            "data", Map.of(
                "username", user.getUsername(),
                "email", user.getEmail()
            )
        );
    }
}