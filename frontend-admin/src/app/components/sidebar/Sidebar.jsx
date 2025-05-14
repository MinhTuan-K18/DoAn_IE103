"use client";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useSidebarStore from "@/store/sideBarStore";
import { LogOut } from "lucide-react";
import { User, Book, Settings, FileWarning, ArrowDownUp, LayoutDashboard } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";


const SidebarItem = ({ path, icon: Icon, label }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();


  const isActive = pathname === path;


  const handleClick = () => {
    router.push(path);
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };


  return (
    <Button
      variant="ghost"
      className={`w-full justify-start mb-3 cursor-pointer flex items-center text-[15px] transition-colors ${
        isActive
          ? "text-white bg-[#6CB1DA]"
          : "text-[#6CB1DA] bg-transparent hover:bg-[#6CB1DA]/10"
      }`}
      onClick={handleClick}
    >
      <Icon className="mr-3 w-5 h-5 self-center" strokeWidth={2} />
      <span className="relative top-[1px]">{label}</span>
    </Button>
  );
};


const Sidebar = () => {
  const { isSidebarOpen } = useSidebarStore();


  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/users", icon: User, label: "Người dùng" },
    { path: "/books", icon: Book, label: "Sách" },
    { path: "/borrow", icon: ArrowDownUp, label: "Mượn/Trả" },
    { path: "/fine", icon: FileWarning, label: "Phiếu phạt" },
    { path: "/setting", icon: Settings, label: "Cài đặt" },
  ];


  return (
    <aside
      className={`fixed left-0 h-full w-52 p-4 transform bg-white transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 shadow-lg ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${isSidebarOpen ? "md:hidden" : ""} md:shadow-none`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <img src="/images/logo.jpg" alt="Vibely Logo" className="w-36" />
        </div>
        <hr className="border-t border-gray-100 mb-6" />


        {/* Navigation */}
        <nav className="space-y-3 flex-grow">
          {menuItems.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </nav>


        <div className="mb-4">
          <Separator className="my-3" />
          <div className="text-xs text-muted-foreground">
            <Button
              variant="ghost"
              className="ml-12 p-4 bg-[#EFF7F7] font-bold rounded-lg text-black hover:bg-[#6CB1DA] hover:text-white transition-colors"
              onClick={() => {}}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};


export default Sidebar;
