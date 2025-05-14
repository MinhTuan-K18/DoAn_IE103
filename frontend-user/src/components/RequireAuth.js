"use client"; // Thêm dòng này ở đầu file

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/app/components/Header";


const RequireAuth = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const publicRoutes = ["/user-login"]; // thêm các route không cần login

  // Kiểm tra token khi có sự thay đổi pathname
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    console.log("TOKEN:", token);

    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/user-login");
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) return null; // Hoặc loading spinner

  // Hàm hiển thị layout với hoặc không có Header
  const LayoutWithHeader = () => {
    // Nếu đang ở trên trang /user-login, không hiển thị Header
    if (pathname === "/user-login") {
      return <>{children}</>;
    }

    // Nếu không phải trang đăng nhập, hiển thị Header
    return (
      <>
        <Header />
        {children}
      </>
    );
  };

  return <LayoutWithHeader />;
};

export default RequireAuth;