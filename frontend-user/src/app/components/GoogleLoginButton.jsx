"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const GoogleLoginButton = () => {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleAccessToken = tokenResponse.access_token;

        const res = await fetch("http://localhost:8080/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ googleAccessToken }),
        });

        const data = await res.json();
        console.log("Response from server:", data.error); // Log the response for debugging

        if (res.ok && data.status === "OK") {
          localStorage.setItem("accessToken", data.ACCESS_TOKEN);
          localStorage.setItem("refreshToken", data.REFRESH_TOKEN);
          router.push("/");
        } else {
          console.error("Đăng nhập thất bại:", data.message || data.error);
          router.push("/user-login");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err.message);
      }
    },
    onError: () => {
      console.error("Đăng nhập Google thất bại");
    },
  });

  return (
    <button
      onClick={() => login()}
      className="w-full flex items-center justify-center border border-gray-300 mt-1 rounded-full py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
    >
      <FcGoogle className="text-xl mr-2" />
      Đăng nhập với Google
    </button>
  );
};

export default GoogleLoginButton;
