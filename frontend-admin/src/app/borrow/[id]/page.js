"use client";
import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Undo2, Trash2, Pencil, BookOpenCheck } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import useSidebarStore from "@/store/sideBarStore";
const page = () => {
  const { id } = useParams();
  const { isSidebarOpen } = useSidebarStore();
  const route = useRouter();
  const handleBack = () => {
    route.push(`../borrow`);
  };

  // 🔹 Giả lập dữ liệu chi tiết từ backend
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

  const data = mockData[id];
  const totalBooks = data.Sach.reduce((sum, Sach) => sum + Sach.SoLuongMuon, 0);

  if (!data) return <p>Không tìm thấy thông tin!</p>;

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
        <div className="flex justify-center items-center w-full  bg-white p-8 mt-6 rounded-[10px] border-[2px] border-gray-300">
          <div className="flex flex-col w-1/2 ">
            <p className="font-bold">Chi tiết phiếu mượn {data.MaPhieuMuon}</p>
            <p className="font-bold">Ngày mượn: {data.NgayMuon}</p>
            <p className="font-bold">Ngày trả dự kiến: {data.NgayTra}</p>
          </div>
          <div className="flex flex-col w-1/2 ">
            <p className="font-bold">ID người dùng: {data.MaNguoiDung}</p>
            <p className="font-bold">Tên người dùng: {data.TenNguyoiDung}</p>
            <p className="font-bold">Số lượng mượn: {totalBooks} </p>
          </div>
        </div>
        {/* Thông tin các sách đã mượn */}
        {data.Sach.map((sach) => (
          <div
            key={sach.MaSach}
            className="flex w-full p-6 bg-white shadow-md mt-6  rounded-[10px] border-[2px] border-gray-300"
          >
            <div className="flex mr-3">
              <img
                src={sach.HinhAnh[0]}
                className="w-[80px] h-[120px]"
                alt={sach.TenSach}
              />
            </div>

            <div className="flex justify-between w-full">
              <div className="flex flex-col justify-between">
                <p className="font-bold text-2xl">{sach.TenSach}</p>
                <p className="text-2xl">{sach.MaTacGia}</p>
                <p className="font-bold text-2xl">{sach.MaSach}</p>
              </div>
              <div className="flex items-end">
                <p className="font-bold text-2xl mr-2">Số Lượng: </p>
                <p className="p-2 rounded-[10px] border-[2px] border-gray-300 font-bold text-xl">
                  {" "}
                  {sach.SoLuongMuon}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="flex justify-between items-center w-full  bg-white p-8 mt-6 rounded-[10px] border-[2px] border-gray-300">
          <div className="flex w-1/2">
            <Button className="mr-4  bg-[#6CB1DA]">
              <Trash2 className="mr-1" />
              Xóa
            </Button>
            <Button className="mr-4  bg-[#6CB1DA]">
              <Pencil className="mr-1" />
              Sửa
            </Button>
          </div>
          <div className="flex ">
            <Button className="mr-4  bg-[#6CB1DA]">
              <BookOpenCheck className="mr-1" />
              Đã giao
            </Button>
            <Button className="mr-4  bg-[#6CB1DA]">
              <Undo2 className="mr-1" />
              Trả sách
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
