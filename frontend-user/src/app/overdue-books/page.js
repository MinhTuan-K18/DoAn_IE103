"use client";
import React, { useState, useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import ChatBox from "../components/ChatBoxButton";
import Image from "next/image";
import useSidebarStore from "@/store/sideBarStore";


const Page = () => {
  const [bookList, setBookList] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/book");
      const data = await res.json();
      const filtered = data.filter((b) => {
        const today = new Date();
        return b.children?.some((c) => {
          if (c.status === "BORROWED" && c.addedDate) {
            const borrowedDate = new Date(c.addedDate);
            const diffDays = Math.floor((today - borrowedDate) / (1000 * 60 * 60 * 24));
            return diffDays > 14; // quá 14 ngày
          }
          return false;
        });
      });
      setBookList(filtered);
    } catch (err) {
      console.error("Lỗi fetch sách quá hạn:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const isSidebarOpen = useSidebarStore();

  return (
    <div className="min-h-screen w-full text-foreground bg-[#EFF3FB] relative">
      <LeftSideBar />
      <div
        className={`fixed top-16 mt-2 right-0 bottom-0 transition-all duration-300 ${
          isSidebarOpen ? "left-[206px]" : "left-0"
        }`}
      >
        <div className="bg-white rounded-lg shadow-md pt-8 pl-8 pr-0 pb-0 h-full overflow-auto">
          <p className="px-3 py-1 w-fit bg-[#6CB1DA] rounded-xl text-white text-lg font-medium mb-7">
            Sách quá hạn
          </p>
          <div className="grid grid-cols-2 gap-x-0 gap-y-6">
            {bookList.map((book) => (
              <div
                key={book.maSach}
                className="flex flex-row gap-6 p-5 rounded-lg"
              >
                <Image
                  src={book.hinhAnh?.[0] || "/images/logo.jpg"}
                  width={100}
                  height={150}
                  alt={book.tenSach}
                  className="rounded-md"
                />
                <div className="flex flex-col gap-2">
                  <div className="px-2 py-1/2 bg-red-500 text-white text-sm w-fit rounded-lg font-semibold">
                    Quá hạn
                  </div>

//                   <h3 className="font-semibold">{book.TenSach}</h3>
//                   <p className="text-sm text-black">Tác giả: {book.TacGia}</p>
//                   <p className="text-sm text-black">NXB: {book.NhaXB}</p>
//                   <p className="text-sm text-black">
//                     Ngày mượn: {book.NgayMuon}
//                   </p>

                  <h3 className="font-semibold">{book.tenSach}</h3>
                  <p className="text-sm text-black">Tác giả: {book.tenTacGia}</p>
                  <p className="text-sm text-black">NXB: {book.nxb} ({book.nam})</p>
                  <p className="text-sm text-black">Ngày mượn: (ẩn - cần backend hỗ trợ)</p>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed flex items-center right-4 bottom-4 z-50">
        <ChatBox />
      </div>
    </div>
  );
};

export default Page;
