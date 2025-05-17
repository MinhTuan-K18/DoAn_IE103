"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Add this import
import { ThreeDot } from "react-loading-indicators";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Undo2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/app/components/ui/button";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resBook = await fetch(`http://localhost:8080/api/books/${id}`);
        if (!resBook.ok) throw new Error(`Lỗi khi lấy sách: ${resBook.status}`);
        const data = await resBook.json();
        setBook(data);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const BookCard = ({ book }) => (
    <div className="flex bg-white w-full rounded-lg shadow-lg p-6 gap-8">
      <img
        src={book.hinhAnh?.[0] || "/placeholder.png"}
        className="w-64 h-96 object-cover rounded-md"
      />
      <div className="flex flex-col gap-3 flex-1 text-sm md:text-base">
        <p>
          <strong>ID:</strong> {book.maSach}
        </p>
        <p>
          <strong>Tên sách:</strong> {book.tenSach}
        </p>
        <p>
          <strong>Tác giả:</strong>{" "}
          {book.tenTacGias?.join(", ") || "Không có tác giả"}
        </p>
        <p>
          <strong>Thể loại:</strong>{" "}
          {book.tenTheLoais?.join(", ") || "Không có thể loại"}
        </p>
        <p>
          <strong>Nhà xuất bản:</strong> {book.tenNXB}
        </p>
        <p>
          <strong>Năm xuất bản:</strong> {book.namXB}
        </p>
        <p>
          <strong>Giá:</strong> {book.gia} VND
        </p>
        <p>
          <strong>Số lượng:</strong> {book.soLuong}
        </p>
        <p>
          <strong>Tình trạng:</strong> {book.tinhTrang}
        </p>
        <p>
          <strong>Tái bản:</strong> {book.taiBan || 0}
        </p>
        <p>
          <strong>Chú thích:</strong> {book.chuThich || "Không có chú thích"}
        </p>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <ThreeDot color="#062D76" size="large" text="Đang tải..." />
        </div>
      </div>
    );

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#EFF3FB]">
      <Sidebar />

      <div className="flex-1 p-6 md:ml-52">
        <Button
          title="Quay Lại"
          className="bg-[#062D76] rounded-3xl w-10 h-10 mb-4"
          onClick={handleGoBack}
        >
          <Undo2 className="w-12 h-12" color="white" />
        </Button>
        {/* Book details */}
        {book && <BookCard book={book} />}
      </div>
    </div>
  );
};

export default Page;
