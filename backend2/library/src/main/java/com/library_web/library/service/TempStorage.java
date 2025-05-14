package com.library_web.library.service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

import com.library_web.library.dto.UserDTO;

public class TempStorage {

    public static class PendingUser {
        private UserDTO userDTO;
        private String otp;
        private LocalDateTime expiredAt;

        public PendingUser(UserDTO userDTO, String otp, LocalDateTime expiredAt) {
            this.userDTO = userDTO;
            this.otp = otp;
            this.expiredAt = expiredAt;
        }

        public UserDTO getUserDTO() { return userDTO; }
        public String getOtp() { return otp; }
        public LocalDateTime getExpiredAt() { return expiredAt; }
    }

    public static class OtpEntry {
        private String otp;
        private LocalDateTime expiredAt;

        public OtpEntry(String otp, LocalDateTime expiredAt) {
            this.otp = otp;
            this.expiredAt = expiredAt;
        }

        public String getOtp() { return otp; }
        public LocalDateTime getExpiredAt() { return expiredAt; }
    }

    private static final ConcurrentHashMap<String, PendingUser> pendingUsers = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, OtpEntry> otpMap = new ConcurrentHashMap<>();

    public static void savePendingUser(UserDTO userDTO, String otp, LocalDateTime expiredAt) {
        pendingUsers.put(userDTO.getEmail(), new PendingUser(userDTO, otp, expiredAt));
    }

    public static PendingUser getPendingUser(String email) {
        return pendingUsers.get(email);
    }

    public static void removePendingUser(String email) {
        pendingUsers.remove(email);
    }

    public static void savePendingOtp(String key, String otp, LocalDateTime expiredAt) {
        otpMap.put(key, new OtpEntry(otp, expiredAt));
    }

    public static boolean isValidOtp(String key, String otp) {
        OtpEntry entry = otpMap.get(key);
        return entry != null && entry.getOtp().equals(otp) && LocalDateTime.now().isBefore(entry.getExpiredAt());
    }

    public static void removeOtp(String key) {
        otpMap.remove(key);
    }
    
}
