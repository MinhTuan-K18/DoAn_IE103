"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";
import { List, Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookList, setBookList] = useState([]);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [deleteOne, setDeleteOne] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchBooks = async (pageNum = 0, keyword = "", status = "all") => {
    setLoading(true);
    try {
      let endpoint = `http://localhost:8080/api/books?page=${pageNum}&size=10`;
      if (keyword || status !== "all") {
        endpoint = `http://localhost:8080/api/books/search?page=${pageNum}&size=10`;
        if (keyword) endpoint += `&keyword=${encodeURIComponent(keyword)}`;
        if (status !== "all") endpoint += `&tinhTrang=${encodeURIComponent(status)}`;
      }
      console.log("Fetching from:", endpoint);
      const { data } = await axios.get(endpoint);
      console.log("API Response:", data);
      setBookList(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(pageNum);
      if (data.content?.length === 0) {
        toast.error("Không có sách nào phù hợp.");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy dữ liệu sách");
      console.error("Fetch error:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page, searchQuery, statusFilter);
  }, [page, statusFilter]);

  const handleSearch = () => {
    console.log("Searching with query:", searchQuery, "and status:", statusFilter);
    setPage(0);
    fetchBooks(0, searchQuery, statusFilter);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleDelete = async (book) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/books/${book.maSach}`);
      toast.success("Xóa sách thành công");
      await fetchBooks(page, searchQuery, statusFilter);
    } catch (error) {
      console.error("Lỗi khi xóa:", error.response || error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.error || "Không thể xóa sách vì đang được mượn");
      } else {
        toast.error("Xóa sách thất bại");
      }
    } finally {
      setLoading(false);
      setPopUpOpen(false);
      setDeleteOne(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const BookCard = ({ book }) => {
    const getTinhTrangText = (tinhTrang) => {
      switch (tinhTrang) {
        case "Hết sách":
          return { text: "Hết sách", color: "text-red-500" };
        case "Thiếu sách":
          return { text: "Thiếu sách", color: "text-yellow-500" };
        case "Đầy đủ sách":
          return { text: "Đầy đủ sách", color: "text-green-600" };
        default:
          return { text: tinhTrang || "Không xác định", color: "text-gray-500" };
      }
    };

    const tinhTrangInfo = getTinhTrangText(book.tinhTrang);

    return (
      <div className="flex bg-white w-full rounded-lg mt-2 p-5 gap-5 md:gap-10 drop-shadow-lg items-center">
        <img
          src={
            book.hinhAnh?.[0]
              ? `http://localhost:8080/api/books/image-proxy?url=${encodeURIComponent(book.hinhAnh[0])}`
              : "https://drahmed.org/wp-content/uploads/2020/09/dentalia-placeholder-img-4-750x500.jpg"
          }
          className="w-[145px] h-[205px] object-cover"
          onError={(e) => (e.target.src = "https://drahmed.org/wp-content/uploads/2020/09/dentalia-placeholder-img-4-750x500.jpg")}
        />
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold">{book.tenSach || "Không có tiêu đề"}</p>
          <p className="italic">{book.tenTacGias?.join(", ") || "Không có tác giả"}</p>
          <p>Nhà xuất bản: {book.tenNXB || "Không xác định"}</p>
          <p>Thể loại: {book.tenTheLoais?.join(", ") || "Không xác định"}</p>
          <p>Số lượng: {book.soLuong ?? 0}</p>
          <p className="font-semibold">
            Trạng thái: <span className={tinhTrangInfo.color}>{tinhTrangInfo.text}</span>
          </p>
          <div className="flex justify-end gap-5 md:gap-10">
            <Button
              onClick={() => router.push(`/books/details/${book.maSach}`)}
              className="bg-[#062D76] hover:bg-gray-700 w-10 md:w-40 h-10"
            >
              <List className="w-5 h-5" color="white" />
              <p className="hidden md:block text-white">Xem chi tiết</p>
            </Button>
            <Button
              onClick={() => router.push(`/books/${book.maSach}`)}
              className="bg-[#062D76] hover:bg-gray-700 w-10 md:w-40 h-10"
            >
              <Pencil className="w-5 h-5" color="white" />
              <p className="hidden md:block text-white">Sửa sách</p>
            </Button>
            {book.tinhTrang !== "Hết sách" && (
              <Button
                onClick={() => {
                  setDeleteOne(book);
                  setPopUpOpen(true);
                }}
                className="bg-[#D66766] hover:bg-gray-700 w-10 md:w-40 h-10"
              >
                <Trash2 className="w-5 h-5" color="white" />
                <p className="hidden md:block text-white">Xóa sách</p>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#EFF3FB]">
      <Sidebar />
      {loading ? (
        <div className="flex md:ml-52 w-full h-screen justify-center items-center">
          <ThreeDot
            color="#062D76"
            size="large"
            text="Vui lòng chờ"
            variant="bounce"
            textColor="#062D76"
          />
        </div>
      ) : (
        <div className="flex w-full flex-col py-6 md:ml-52 gap-2 items-center px-10 mt-5">
          <div className="flex w-full items-center justify-between mb-10">
            <div className="flex gap-2 p-2 rounded-md w-full max-w-5xl items-center">
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên sách, tác giả..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 h-10 p-3 text-black bg-white shadow font-thin italic"
              />
              
              <Button
                onClick={handleSearch}
                className="w-10 h-10 bg-[#062D76] hover:bg-gray-700 shadow rounded-md"
              >
                <Search className="w-5 h-5" color="white" />
              </Button>
            </div>
            <div className="flex gap-4 ml-5">
            
              <Button
                onClick={() => router.push("/books/addBook")}
                className="w-40 h-10 bg-[#062D76] hover:bg-gray-700 font-bold rounded-[10px]"
              >
                <Plus className="w-5 h-5" color="white" />
                Thêm sách mới
              </Button>
            </div>
          </div>

          {Array.isArray(bookList) && bookList.length > 0 ? (
            <>
              {bookList.map((book) => (
                <BookCard key={book.maSach} book={book} />
              ))}
              <div className="flex gap-4 mt-4">
                <Button
                  disabled={page === 0}
                  onClick={() => handlePageChange(page - 1)}
                  className="bg-[#062D76] hover:bg-gray-700"
                >
                  Trang trước
                </Button>
                <span className="self-center">
                  Trang {page + 1} / {totalPages}
                </span>
                <Button
                  disabled={page >= totalPages - 1}
                  onClick={() => handlePageChange(page + 1)}
                  className="bg-[#062D76] hover:bg-gray-700"
                >
                  Trang sau
                </Button>
              </div>
            </>
          ) : (
            <p>Không có sách nào để hiển thị.</p>
          )}
        </div>
      )}
      {popUpOpen && deleteOne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-80"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-120">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa sách này không?</p>
            <div className="flex mt-4 gap-5">
              <img
                src={
                  deleteOne.hinhAnh?.[0]
                    ? `http://localhost:8080/api/books/image-proxy?url=${encodeURIComponent(
                        deleteOne.hinhAnh[0]
                      )}`
                    : "/https://drahmed.org/wp-content/uploads/2020/09/dentalia-placeholder-img-4-750x500.jpg"
                }
                className="w-[145px] h-[205px] object-cover"
                onError={(e) => (e.target.src = "https://drahmed.org/wp-content/uploads/2020/09/dentalia-placeholder-img-4-750x500.jpg")}
              />
              <div className="flex flex-col gap-2">
                <p>Mã sách: {deleteOne.maSach}</p>
                <p className="font-bold">{deleteOne.tenSach}</p>
                <p className="italic">{deleteOne.tenTacGias?.join(", ") || "Không có tác giả"}</p>
                <p>Số lượng: {deleteOne.soLuong ?? 0}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                onClick={() => setPopUpOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white"
              >
                Hủy
              </Button>
              <Button
                onClick={() => handleDelete(deleteOne)}
                className="bg-red-500 hover:bg-red-700 text-white"
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;