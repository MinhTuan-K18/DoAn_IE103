"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Chỉ import useRouter từ next/navigation
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import useSidebarStore from "@/store/sideBarStore";
const page = () => {
  const { isSidebarOpen } = useSidebarStore();
  const route = useRouter();
  const handleBack = () => {
    route.push(`../borrow`);
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

  // Lấy ID lớn nhất và +1
  const getNextId = () => {
    const ids = Object.keys(mockData).map(Number); // Chuyển key sang số
    return Math.max(...ids) + 1; // Lấy max rồi +1
  };

  // State lưu giá trị ID mới
  const [newId, setNewId] = useState(getNextId());

  // Khi dữ liệu thay đổi (nếu có backend), cập nhật lại ID
  useEffect(() => {
    setNewId(getNextId());
  }, [mockData]);

  // 🔹 Thêm useState để lưu giá trị của dropdown
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserName, setSelectedUserName] = useState(""); // Lưu tên người dùng

  // 🔹 Hàm xử lý khi chọn ID
  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedUser(selectedId);

    // Tìm tên người dùng theo ID
    const user = Object.values(mockData).find(
      (user) => user.MaNguoiDung == selectedId
    );
    setSelectedUserName(user ? user.TenNguyoiDung : "");
  };

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
      <Sidebar />

      {/* content */}
      <div
        className={`flex-1 py-6 px-10 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <Button
          className="px-4 py-2  bg-[#6CB1DA] rounded-full"
          onClick={() => {
            handleBack();
          }}
        >
          <Undo2 className="w-10 h-10 text-white" />
        </Button>

        {/* Header */}
        <div className="flex flex-col w-full  bg-white p-8 mt-6 rounded-[10px] border-[2px] border-gray-300">
          <p className="font-bold mb-2">ID (Tự Động)</p>
          <Input
            value={newId}
            readOnly
            className="bg-gray-200 cursor-not-allowed"
          />

          <div className="flex w-full mt-6">
            <div className="flex flex-col w-1/2 mr-4">
              <p className="">ID Người Dùng</p>
              <select
                value={selectedUser}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              >
                <option value="" disabled>
                  Chọn ID...
                </option>
                {Object.values(mockData).map((user) => (
                  <option key={user.MaNguoiDung} value={user.MaNguoiDung}>
                    {user.MaNguoiDung}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-1/2">
              <p className="">Tên Người Dùng</p>
              <Input
                value={selectedUserName}
                readOnly
                className="bg-gray-200 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default page;
