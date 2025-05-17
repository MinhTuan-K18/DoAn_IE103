"use client";

import React, { useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import CollectionCard from "./CollectionCard";
import ServiceHoursCard from "./ServiceHoursCard";
import ChatBotButton from "../components/ChatBoxButton";
import axios from "axios";
import { CheckCircle, XCircle, AlertTriangle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [actionType, setActionType] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, q]);

  const fetchBooks = async () => {
    try {
      const endpoint = q
        ? `http://localhost:8080/api/books/search?keyword=${encodeURIComponent(q)}&page=${page}&size=12`
        : `http://localhost:8080/api/books?page=${page}&size=12`;
      const { data } = await axios.get(endpoint);
      setBooks(normalize(data.content));
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const normalize = (arr) =>
    arr?.map((b) => {
      let statusIcon, statusTextColor;
      if (b.tinhTrang === "Đầy đủ sách") {
        statusIcon = <CheckCircle className="text-green-600 w-4 h-4" />;
        statusTextColor = "text-green-600 bg-green-100";
      } else if (b.tinhTrang === "Hết sách") {
        statusIcon = <XCircle className="text-red-600 w-4 h-4" />;
        statusTextColor = "text-red-600 bg-red-100";
      } else if (b.tinhTrang === "Thiếu sách") {
        statusIcon = <AlertTriangle className="text-yellow-600 w-4 h-4" />;
        statusTextColor = "text-yellow-600 bg-yellow-100";
      } else {
        statusIcon = <CheckCircle className="text-gray-500 w-4 h-4" />;
        statusTextColor = "text-gray-500 bg-gray-100";
      }

      return {
        id: b.maSach,
        imageSrc: b.hinhAnh?.[0] || "",
        title: b.tenSach,
        authors: b.tenTacGias?.join(", ") || "",
        publisher: b.tenNXB,
        price: b.gia || 0,
        quantity: b.soLuong || 0,
        status: b.tinhTrang || "Còn sẵn",
        statusIcon,
        statusTextColor,
      };
    });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const handleBorrow = (book, e) => {
    e.stopPropagation();
    setSelectedBook(book);
    setActionType("borrow");
    setPopUpOpen(true);
  };

  const handleBuy = (book, e) => {
    e.stopPropagation();
    setSelectedBook(book);
    setActionType("buy");
    setPopUpOpen(true);
  };

  const handleConfirmAction = () => {
    if (actionType === "borrow") {
      toast.success("Mượn sách thành công");
    } else if (actionType === "buy") {
      toast.success("Mua sách thành công");
    }
    setPopUpOpen(false);
    setSelectedBook(null);
    setActionType("");
  };

  const handleCancel = () => {
    setPopUpOpen(false);
    setSelectedBook(null);
    setActionType("");
  };

  const handleBookClick = (bookId) => {
    router.push(`/Homepage/details/${bookId}`);
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <main className="pt-16 flex">
        <LeftSideBar />
        <section className="flex-1 pr-5 md:pl-64 ml-5 mt-2">
          <div className="flex lg:flex-row flex-col gap-3 mt-0">
            <ServiceHoursCard />
            <div className="grid md:grid-cols-2 gap-3 lg:w-2/3">
              <CollectionCard
                title="Tài liệu số"
                category="Bộ sưu tập"
                imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/9b777cb3ef9abb920d086e97e27ac4f6f3559695"
                bgColor="bg-teal-500"
                buttonTextColor="text-teal-500"
              />
              <CollectionCard
                title="Sách"
                category="Bộ sưu tập"
                imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/9b777cb3ef9abb920d086e97e27ac4f6f3559695"
                bgColor="bg-sky-600"
                buttonTextColor="text-sky-600"
              />
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow backdrop-blur-sm mt-5"
          >
            <Search className="w-6 h-6 text-gray-500" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm sách, tác giả, thể loại, NXB..."
              className="flex-1 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded-full ml-2"
            >
              Tìm
            </button>
          </form>

          <section className="mt-5 bg-white rounded-xl p-5">
            {books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                  alt="No results"
                  className="w-24 h-24 mb-4 opacity-60"
                />
                <p className="text-xl font-semibold text-center">
                  Không tìm thấy kết quả nào cho từ khóa{" "}
                  <span className="text-blue-600">"{q}"</span>
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-6 w-full">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white px-2 py-2 mb-8 shadow-md rounded-lg overflow-hidden flex flex-col border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      onClick={() => handleBookClick(book.id)}
                    >
                      <div className="relative h-64">
                        <img
                          src={book.imageSrc || "https://via.placeholder.com/150"}
                          alt={book.title}
                          className="w-full h-full object-contain"
                        />
                        <div
                          className={`absolute top-2 right-2 flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${book.statusTextColor}`}
                        >
                          {book.statusIcon}
                          <span>{book.status}</span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold h-12 overflow-hidden truncate">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 h-6 truncate">
                          Tác giả: {book.authors}
                        </p>
                        <p className="text-sm text-gray-600 h-6 truncate">
                          NXB: {book.publisher}
                        </p>
                        <p className="text-sm text-gray-600 h-6 truncate">
                          Giá: {book.price.toLocaleString()} đ
                        </p>
                        <p className="text-sm text-gray-600 h-6">
                          Số lượng: {book.quantity}
                        </p>
                        <div className="flex gap-2 mt-6" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleBorrow(book, e)}
                            disabled={book.status === "Hết sách"}
                            className={`flex-1 px-3 py-1 rounded text-white ${
                              book.status === "Hết sách"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                            }`}
                          >
                            Mượn sách
                          </button>
                          <button
                            onClick={(e) => handleBuy(book, e)}
                            disabled={book.status === "Hết sách" || book.quantity === 0}
                            className={`flex-1 px-3 py-1 rounded text-white ${
                              book.status === "Hết sách" || book.quantity === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600 cursor-pointer"
                            }`}
                          >
                            Mua
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-around mt-3">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Trang trước
                  </button>
                  <span>
                    Trang {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Trang sau
                  </button>
                </div>
              </>
            )}
          </section>
        </section>
        <ChatBotButton />
      </main>
      {popUpOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-80"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-120">
            <h2 className="text-lg font-bold mb-4">
              Xác nhận {actionType === "borrow" ? "Mượn" : "Mua"} sách
            </h2>
            <p>
              Bạn có chắc chắn muốn {actionType === "borrow" ? "mượn" : "mua"} sách này không?
            </p>
            <div className="flex mt-4 gap-5">
              <img
                src={selectedBook.imageSrc || "https://via.placeholder.com/150"}
                className="w-[145px] h-[205px] object-cover"
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              />
              <div className="flex flex-col gap-2">
                <p>Mã sách: {selectedBook.id}</p>
                <p className="font-bold">{selectedBook.title}</p>
                <p className="italic">{selectedBook.authors || "Không có tác giả"}</p>
                <p>Số lượng: {selectedBook.quantity ?? 0}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-700 text-white"
              >
                Hủy
              </Button>
              <Button
                onClick={handleConfirmAction}
                className={`${
                  actionType === "borrow"
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-green-500 hover:bg-green-700"
                } text-white`}
              >
                {actionType === "borrow" ? "Mượn" : "Mua"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;