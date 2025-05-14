"use client";

import { useEffect } from "react";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";

const FacebookLoginButton = () => {
  const router = useRouter();
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1685034505554675",
        cookie: true,
        xfbml: true,
        version: "v19.0", // mới nhất
      });
    };
  }, []);

  const handleLogin = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          // Gửi accessToken về backend
          fetch("http://localhost:8080/api/auth/facebook", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status === "OK") {
                localStorage.setItem("accessToken", data.ACCESS_TOKEN);
                localStorage.setItem("refreshToken", data.REFRESH_TOKEN);
                router.push("/");
              } else {
                console.error("Đăng nhập thất bại");
                router.push("/user-login");
              }
            });
        }
      },
      { scope: "email,public_profile" }
    );
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center border border-gray-300 mt-1 rounded-full py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
    >
      <FaFacebook className="text-xl mr-2" />
      Đăng nhập với Facebook
    </button>
  );
};

export default FacebookLoginButton;
