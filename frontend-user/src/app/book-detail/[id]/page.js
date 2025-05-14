"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LeftSideBar from "../../components/LeftSideBar";
import ChatBotButton from "../../components/ChatBoxButton";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import BookReview from "../../../components/ui/bookreview";
import axios from "axios";
import { BsCartPlus } from "react-icons/bs";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const user = JSON.parse(localStorage.getItem("persist:root")); // lấy thông tin người dùng từ localStorage
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // map enum sang label
  const statusMap = {
    CON_SAN: {
      label: "Còn sẵn",
      icon: <CheckCircle className="text-green-500" />,
      available: true,
    },
    DA_HET: {
      label: "Đã hết",
      icon: <XCircle className="text-red-500" />,
      available: false,
    },
    // DA_XOA:  { label: "Đã xóa",   icon: <XCircle className="text-red-500" />,   available: false },
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/book/${id}`
        );
        // nếu backend trả về mảng, lấy phần tử đầu
        const book = Array.isArray(data) ? data[0] : data;
        setDetails(book);
      } catch (err) {
        console.error("Lỗi khi fetch chi tiết sách:", err);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    const checkBookInCart = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/cart/${user.id}`);
        const cartBooks = res.data.data; // giả sử trả về mảng books [{ id: ..., ... }]
        const found = cartBooks?.some(book => book.bookId == id); // id là id của sách hiện tại
        setIsAddedToCart(found);
      } catch (error) {
        console.error("Lỗi khi kiểm tra giỏ hàng:", error);
      }
    };
  
    checkBookInCart();
  }, [user.id, id]);

  if (!details) {
    return (
      <div className="flex items-center justify-center h-64">
        <span>Loading...</span>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/cart/${user.id}/add/books`,
          [id] // đưa vào mảng 1 phần tử
      );

      alert("Đã thêm sách vào giỏ!");
      console.log(res.data);
      setIsAddedToCart(true); // Đánh dấu là đã thêm vào giỏ hàng

      // Reload lại trang để làm mới giỏ hàng
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi thêm sách vào giỏ:", error);
      alert("Có lỗi xảy ra khi thêm sách vào giỏ.");
    }
  };

  const handleBorrowBook = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("persist:root")); // lấy thông tin người dùng từ localStorage
      console.log(id);
      // gửi yêu cầu mượn sách
      const response = await axios.post(
        `http://localhost:8080/api/borrow-cards`,
        {
          userId: user.id,
          borrowedBooks: [
            {
              bookId: id,
              childBookId: null,
            },
          ],
          borrowDate: new Date().toISOString(),
          status: "REQUESTED",
          dueDate: new Date(
            new Date().setDate(new Date().getDate() + 14)
          ).toISOString(), // Ngày trả sách là 14 ngày sau
        }
      );

      if (response.status === 200) {
        alert("Phiếu mượn đã được tạo");
        console.log("Phiếu mượn đã được tạo:", response.data);
        window.location.href = "/borrowed-card";
      } else {
        alert("Có lỗi xảy ra khi tạo phiếu mượn");
      }
    } catch (error) {
      console.error("Lỗi khi mượn sách:", error);
      alert("Có lỗi xảy ra khi mượn sách");
    }
  };

  // Tính trạng thái ưu tiên trangThai, nếu null thì dựa vào children
  let key = details.trangThai;
  if (!key) {
    const anyAvailable = details.children?.some((c) => c.available);
    key = anyAvailable ? "CON_SAN" : "DA_HET";
  }
  const { label, icon, available } = statusMap[key] || statusMap.CON_SAN;

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <main className="pt-16 flex">
        <LeftSideBar />
        <section className="flex-1 pr-5 md:pl-64 ml-5 mt-2">
          {/* Chi tiết chính */}
          <div className="flex flex-col p-6 bg-white rounded-xl shadow-md md:flex-row gap-6">
            <img
              src={details.hinhAnh?.[0] || ""}
              alt={details.tenSach}
              className="w-40 md:w-52 rounded-lg shadow-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-blue-900">
                {details.tenSach}
              </h1>
              <p className="text-gray-700 font-semibold">
                Tác giả: {details.tenTacGia}
              </p>
              <p>
                <span className="font-semibold">Thể loại:</span>{" "}
                {details.categoryChildName ?? "—"}
              </p>
              <p>
                <span className="font-semibold">NXB:</span> {details.nxb}
              </p>
              <p className="flex items-center gap-2 font-semibold">
                Trạng thái: {label}
              </p>
              <p>
                <span className="font-semibold">Lượt mượn:</span>{" "}
                {details.soLuongMuon} lượt
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Button
                  onClick={handleBorrowBook}
                  className="mt-4 bg-[#062D76] hover:bg-[#E6EAF1] hover:text-[#062D76] text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                >
                  Mượn ngay
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddedToCart}
                  className={`mt-4 font-semibold py-2 px-4 rounded-lg border-2 flex items-center gap-2
    ${
      isAddedToCart
        ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
        : "bg-white hover:bg-[#E6EAF1] hover:text-[#062D76] text-[#062D76] cursor-pointer border-[#062D76]"
    }`}
                >
                  <BsCartPlus
                    style={{ width: "1.5rem", height: "1.5rem" }}
                    className="size-6"
                  />
                  {isAddedToCart ? "Đã thêm" : "Thêm vào giỏ sách"}
                </Button>
              </div>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-lg font-medium bg-[#E6EAF1] text-[#062D76] p-2 rounded-lg w-fit">
              Thông tin chi tiết
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <p>
                <span className="font-semibold">Mã sách:</span> {details.maSach}
              </p>
              <p>
                <span className="font-semibold">Năm XB:</span> {details.nam}
              </p>
              <p>
                <span className="font-semibold">Trọng lượng:</span>{" "}
                {details.trongLuong} g
              </p>
              <p>
                <span className="font-semibold">Đơn giá:</span> {details.donGia}{" "}
                đ
              </p>
              <p>
                <span className="font-semibold">Tổng số lượng:</span>{" "}
                {details.tongSoLuong}
              </p>
            </div>
          </div>

          {/* Giới thiệu */}
          <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-lg font-medium bg-[#E6EAF1] text-[#062D76] p-2 rounded-lg w-fit">
              Giới thiệu
            </h2>
            <p className="mt-6 text-gray-800 leading-relaxed">
              {details.moTa || "Chưa có mô tả."}
            </p>
          </div>

          {/* Reviews */}
          <div className="mt-6">
            <BookReview bookId={details.maSach} />
          </div>
        </section>
        <ChatBotButton />
      </main>
    </div>
  );
};

export default BookDetailsPage;
