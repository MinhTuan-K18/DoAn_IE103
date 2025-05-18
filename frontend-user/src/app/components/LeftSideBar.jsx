"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useSidebarStore from "@/store/sidebarStore.js";
import { Bell, BookText, CircleAlert, LockKeyhole, User, ClipboardList, X } from "lucide-react";
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

  const getButtonClass = (path) =>
    pathname.includes(path)
      ? "bg-[#6CB1DA] text-white"
      : "text-gray-700 hover:bg-[#6CB1DA] hover:text-white";

  const handleLogout = async () => {
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

  const navItems = [
    { path: "/user-profile", label: "Hồ sơ cá nhân", icon: User },
    { path: "/borrowed-books", label: "Sách đang mượn", icon: BookText },
    { path: "/overdue-books", label: "Sách quá hạn", icon: CircleAlert },
    { path: "/borrowed-card", label: "Phiếu mượn", icon: ClipboardList },
    { path: "/change-password", label: "Đổi mật khẩu", icon: LockKeyhole },
    { path: "/notification", label: "Thông báo", icon: Bell },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-60 bg-white shadow-lg pt-4 transform transition-transform duration-300 ease-in-out z-50 md:z-0 md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:shadow-none`}
    >
      <div className="flex flex-col h-full">
        {/* Nút đóng sidebar trên mobile */}
        {isSidebarOpen && (
          <Button
            variant="ghost"
            className="self-end mr-4 md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6" />
          </Button>
        )}

        <nav className="flex flex-col space-y-2 flex-grow px-3">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              variant="ghost"
              className={`w-full justify-start py-3 text-base font-medium transition-colors group ${getButtonClass(
                path
              )}`}
              onClick={() => handleNavigation(path)}
            >
              <Icon
                className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform"
                strokeWidth={1.75}
              />
              {label}
            </Button>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <Separator className="my-3" />
          <Button
            variant="ghost"
            className="w-full justify-start py-3 text-base font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
            onClick={handleLogout}
          >
            <LockKeyhole
              className="mr-3 h-5 w-5"
              strokeWidth={1.75}
            />
            Đăng xuất
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;