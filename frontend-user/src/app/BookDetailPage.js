"use client";
import React, { useState, useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import ChatBox from "../components/ChatBox";
import Image from "next/image";
import useSidebarStore from "@store/sidebarStore";


const BookDetailPage = () => {
  const [book, setBook] = useState(null);

  const fetchBookDetails = async () => {
    const bookData = {
      MaSach: "MS001",
      TenSach: "Số Đỏ",
      TacGia: "Vũ Trọng Phụng",
      TheLoai: "Văn học",
      NhaXB: "Nhã Nam",
      status: "Còn sách",
      KichThuoc: "24 x 19 x 0.4 cm",
      SoTrang: 96,
      HinhAnh: "/images/logo.jpg",
      LuotMuon: 257,
      GioiThieu:
        "Số đỏ là một bức tranh châm biếm sâu sắc về xã hội Việt Nam trong những năm 1930, tiết lộ những khía cạnh tối tăm của xã hội, từ sự thống trị vô đạo đức, sự giả tạo của tầng lớp thượng lưu, cho đến sự ngu muội và mê tín của tầng lớp lao động. Cuốn sách mang đến tiếng cười vui sướng thông qua việc phơi bày trần trụi tất cả những tệ nạn, và sự sảng khoái đến từ những tình huống trớ trêu, đầy bất ngờ. Đồng thời, tiếng cười cũng là sự chiến thắng, biểu trưng cho niềm tin vào một tương lai tươi sáng. Qua tiếng cười châm biếm, Vũ Trọng Phụng khẳng định rằng cái ác và xấu xa cuối cùng sẽ bị tiêu diệt, và con người hướng đến một xã hội tốt đẹp hơn.",
    };
    setBook(bookData);
  };

  useEffect(() => {
    fetchBookDetails();
  }, []);
  const isSideBarOpen = useSideBarStore();

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full text-foreground bg-[#EFF3FB] relative">
      {/* Sidebar */}
      <LeftSideBar />

      {/* Nội dung chính cố định */}
      <div
        className={`fixed top-16 mt-2 right-0 bottom-0 transition-all duration-300 ${
          isSideBarOpen ? "left-[206px]" : "left-0"
        }`}
      >
        {/*Breadcrumb */}
        <div className="bg-white p-2 mb-3 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <p className="text-gray-500">Thể loại</p>
            <span className="text-gray-500"></span>
            <p className="text-gray-500">Sách Tiếng Việt</p>
            <span className="text-gray-500"></span>
            <p className="text-gray-500">Văn học</p>
          </div>
        </div>

        {/*  Book Details */}
        <div className="bg-white p-5 mb-3 rounded-lg shadow-md border">
          <div className="flex flex-row gap-6">
            <Image
              src={book.HinhAnh}
              width={150}
              height={200}
              alt={book.TenSach}
              className="rounded-md"
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold">{book.TenSach}</h3>
              <p className="text-sm text-black font-medium">Tác giả: {book.TacGia}</p>
              <p className="text-sm text-black font-medium">Thể loại: {book.TheLoai}</p>
              <p className="text-sm text-black font-medium">NXB: {book.NhaXB}</p>
              <p className="text-sm text-black font-medium flex items-center">
                Trạng thái: {book.status}
                <span className="ml-2 w-3 h-3 bg-green-500 rounded-full"></span>
              </p>
              <p className="text-sm text-black font-medium">
                Lượt mượn: {book.LuotMuon} lượt
              </p>
              <button className="mt-3 px-4 py-2 bg-[#6CB1DA] text-white rounded-lg hover:bg-blue-600 transition-colors">
                Mượn sách
              </button>
            </div>
          </div>
        </div>

        {/*  Additional Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-3">Thông tin chi tiết</h4>
          <div className="grid grid-cols-2 gap-y-2 text-sm text-black mb-4">
            <p>Mã sách: {book.MaSach}</p>
            <p>Tác giả: {book.TacGia}</p>
            <p>NXB: {book.NhaXB}</p>
            <p>Kích thước: {book.KichThuoc}</p>
            <p>Số trang: {book.SoTrang}</p>
          </div>
          <h4 className="text-lg font-semibold mb-4">Giới thiệu</h4>
          <p className="text-sm text-black">{book.GioiThieu}</p>
        </div>
      </div>

      {/* ChatBox */}
      <div className="fixed flex items-center right-4 bottom-4 z-50">
        <ChatBox />
      </div>
    </div>
  );
};

export default BookDetailPage;
