"use client";
import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { History, Search, Plus, IndentIncrease, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import useSidebarStore from "@/store/sideBarStore";

const page = () => {
  const { isSidebarOpen } = useSidebarStore(); 
  const router = useRouter();

  const handleDetail = (id) => {
    router.push(`/borrow/${id}`);
  };
  const handleReturn = () => {
    router.push(`/return`);
  };
  const handleBorrow = () => {
    router.push(`/borrow`);
  };
  const handleAddBorrow = () => {
    router.push(`/borrow/addBorrow`);
  };

  // 🔹 Mock data (giả lập dữ liệu từ backend)
  const mockData = {
    10: {
      MaPhieuMuon: 10,
      MaNguoiDung: 20,
      TenNguyoiDung: "Nguyen Thanh Tri",
      NgayMuon: "09/03/2025",
      NgayTra: "23/03/2025",
      Sach: [
        {
          MaSach: "id sach1",
          TenSach: "Tên sách 1",
          MoTa: "Mo ta mau",
          MaTheLoai: "ma the loai",
          MaTacGia: "ma tac gia",
          HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
          SoLuongTon: 70,
          SoLuongMuon: 1,
        },
        {
          MaSach: "id sach2",
          TenSach: "Tên sách 2",
          MoTa: "Mo ta mau",
          MaTheLoai: "ma the loai",
          MaTacGia: "ma tac gia",
          HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
          SoLuongTon: 70,
          SoLuongMuon: 2,
        },
        {
          MaSach: "id sach3",
          TenSach: "Tên sách 3",
          MoTa: "Mo ta mau",
          MaTheLoai: "ma the loai",
          MaTacGia: "ma tac gia",
          HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
          SoLuongTon: 70,
          SoLuongMuon: 3,
        },
      ],
    },
    11: {
      MaPhieuMuon: 11,
      MaNguoiDung: 18,
      TenNguyoiDung: "Le Thi Thuy Trang",
      NgayMuon: "09/03/2025",
      NgayTra: "16/03/2025",
      Sach: [
        {
          MaSach: "id sach1",
          TenSach: "Tên sách 1",
          MoTa: "Mo ta mau",
          MaTheLoai: "ma the loai",
          MaTacGia: "ma tac gia",
          HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
          SoLuongTon: 70,
          SoLuongMuon: 1,
        },
        {
          MaSach: "id sach2",
          TenSach: "Tên sách 2",
          MoTa: "Mo ta mau",
          MaTheLoai: "ma the loai",
          MaTacGia: "ma tac gia",
          HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
          SoLuongTon: 70,
          SoLuongMuon: 2,
        },
      ],
    },
    12: {
      MaPhieuMuon: 12,
      MaNguoiDung: 71,
      TenNguyoiDung: "Nguyen Le Thanh Huyen",
      NgayMuon: "10/03/2025",
      NgayTra: "17/03/2025",
      Sach: [
        {
          MaSach: "id sach1",
          TenSach: "Tên sách 1",
          MoTa: "Mo ta mau",
          MaTheLoai: "ma the loai",
          MaTacGia: "ma tac gia",
          HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
          SoLuongTon: 70,
          SoLuongMuon: 1,
        },
      ],
    },
  };

  return (
    <div className="flex flex-row w-full h-screen bg-[#F4F7FE]">
      <Sidebar />
      <div
        className={`flex-1 py-6 px-10 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <div className="flex flex-col w-full p-6">
          {/* Thanh công cụ */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
            <button
              className="flex justify-center items-center w-80 gap-2 bg-blue-400 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => handleBorrow()}
            >
              <span className="text-xs font-semibold bg-white text-blue-400 px-2 py-1 rounded-full">
                NOW
              </span>
              <BookOpen className="w-5 h-5 text-white" />
              Đang Mượn
            </button>
            <button
              className="flex justify-center items-center w-80 gap-2 bg-blue-200 text-gray-700 font-bold py-2 px-4 rounded-full"
              onClick={() => handleReturn()}
            >
              <History className="w-5 h-5 text-gray-600" />
              Đã Trả
            </button>
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-white">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="outline-none border-none bg-transparent text-gray-600 px-2"
              />
              <button className="text-blue-400">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Danh sách mượn */}
          <div className="flex flex-col w-full gap-6 mt-6">
            {Object.values(mockData).map((data) => (
              <div
                key={data.MaPhieuMuon}
                className="flex flex-col bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1/2">
                    <p className="text-lg font-semibold">
                      ID: {data.MaPhieuMuon}
                    </p>
                    <p className="text-lg font-semibold">
                      User ID: {data.MaNguoiDung}
                    </p>
                    <p className="font-semibold">Ngày mượn: {data.NgayMuon}</p>
                    <p className="font-semibold">
                      Ngày trả dự kiến: {data.NgayTra}
                    </p>
                  </div>
                  <Button
                    className="flex-1/4 items-center gap-2 bg-[#6CB1DA] text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => handleDetail(data.MaPhieuMuon)}
                  >
                    <IndentIncrease className="w-5 h-5" />
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Nút Thêm */}
          <button
            className="flex justify-center items-center fixed bottom-4 right-4 w-16 h-16 bg-[#6CB1DA] rounded-full"
            onClick={() => handleAddBorrow()}
          >
            <Plus className="w-10 h-10 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
