"use client"; // Đánh dấu đây là client component

import { useEffect } from "react";

const FacebookSDK = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.FB) {
      // Chỉ tải SDK nếu chưa có window.FB
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.FB.init({
          appId: "1685034505554675", // ID ứng dụng Facebook của bạn
          cookie: true,
          xfbml: true,
          version: "v19.0", // Phiên bản SDK mới nhất
        });
      };
    }
  }, []);

  return null; // Component này không cần render gì, chỉ cần load SDK
};

export default FacebookSDK;
