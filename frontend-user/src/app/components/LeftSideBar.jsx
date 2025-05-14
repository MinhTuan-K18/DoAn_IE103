"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useSidebarStore from "@/store/sidebarStore.js";
import { Bell, BookText, CircleAlert, LockKeyhole, User, ClipboardList } from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

const LeftSideBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path) => {
    router.push(path);
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  const getButtonClass = (path) => {
    return pathname.includes(path)
      ? "bg-[#062D76] text-white hover:bg-[#062D76] hover:text-white" 
      : "active:bg-[#062D76] active:text-white"; // 
  };

  const handlelogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      localStorage.removeItem("jwt");
      localStorage.removeItem("id");
      localStorage.removeItem("access_token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/user-login");
      toast.success("Đăng xuất thành công!");
    }
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-48 pt-2 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${
        isSidebarOpen ? "translate-x-0 bg-white shadow-lg" : "-translate-x-full"
      } ${isSidebarOpen ? "md:hidden" : ""} md:bg-transparent md:shadow-none`}
    >
      <div className="flex bg-white flex-col rounded-lg h-full overflow-y-auto">
        <nav className="space-y-4 flex-grow">
          <Button
            variant="ghost"
            className={`w-full justify-start mt-5 transition-colors ${
              pathname === "/user-profile"
                ? "bg-[#6CB1DA] text-white"
                : "hover:bg-[#6CB1DA] hover:text-white"
            }`}
            onClick={() => handleNavigation("/user-profile")}
          >
            <User className="mr-4" /> Hồ sơ cá nhân
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start transition-colors ${
              pathname === "/borrowed-books"
                ? "bg-[#6CB1DA] text-white"
                : "hover:bg-[#6CB1DA] hover:text-white"
            }`}
            onClick={() => handleNavigation("/borrowed-books")}
          >
            <BookText className="mr-4" /> Sách đang mượn
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start transition-colors ${
              pathname === "/overdue-books"
                ? "bg-[#6CB1DA] text-white"
                : "hover:bg-[#6CB1DA] hover:text-white"
            }`}
            onClick={() => handleNavigation("/overdue-books")}
          >
            <CircleAlert className="mr-4" /> Sách quá hạn
          </Button>

          <Button
            variant="ghost"
            className={`flex justify-start py-5 items-center cursor-pointer w-full text-[1.125rem] font-normal ${getButtonClass("/borrowed-card")}`}
            onClick={() => handleNavigation("/borrowed-card")}
          >
            <ClipboardList style={{ width: "1.5rem", height: "1.5rem", strokeWidth: "1.5px" }} className="mr-2" /> Phiếu mượn
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start transition-colors ${
              pathname === "/change-password"
                ? "bg-[#6CB1DA] text-white"
                : "hover:bg-[#6CB1DA] hover:text-white"
            }`}
            onClick={() => handleNavigation("/change-password")}
          >
            <LockKeyhole className="mr-4" /> Đổi mật khẩu
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start transition-colors ${
              pathname === "/notification"
                ? "bg-[#6CB1DA] text-white"
                : "hover:bg-[#6CB1DA] hover:text-white"
            }`}
            onClick={() => handleNavigation("/notification")}
          >
            <Bell className="mr-4" /> Thông báo
          </Button>
        </nav>

        <div className="mb-4">
          <Separator className="my-3" />
          <div className="text-xs text-muted-foreground">
            <Button
              variant="ghost"
              className="ml-12 p-4 bg-[#EFF7F7] font-bold rounded-lg text-black hover:bg-[#6CB1DA] hover:text-white transition-colors"
              onClick={handlelogout}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
