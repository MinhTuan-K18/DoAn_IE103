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
  const [mode, setMode] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookList, setBookList] = useState([]);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [deleteOne, setDeleteOne] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchBook = async (pageNum = 0) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/books", {
        params: { page: pageNum, size: 12 },
      });
      setBookList(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNum);
    } catch (error) {
      toast.error("Lỗi khi lấy dữ liệu sách");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = { page: 0, size: 12 };
      if (mode === "tenSach") params.tenSach = searchQuery;
      else if (mode === "maNXB") params.maNXB = Number(searchQuery) || null;
      else if (mode === "namXB") {
        if (/^\d{4}$/.test(searchQuery.trim())) params.namXB = Number(searchQuery.trim());
        else {
          toast.error("Nhập năm theo dạng YYYY");
          setLoading(false);
          return;
        }
      } else if (mode === "ngonNgu") params.ngonNgu = searchQuery;
      else if (mode === "tinhTrang") params.tinhTrang = searchQuery;

      if (statusFilter !== "all") params.tinhTrang = statusFilter;

      const { data } = await axios.get("http://localhost:8080/api/books/search", { params });
      setBookList(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(0);
      if (data.content.length === 0) toast.error("Không tìm thấy kết quả");
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      toast.error("Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (book) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/books/${book.maSach}`);
      toast.success("Xóa sách thành công");
      await fetchBook(page);
    } catch (error) {
      console.error("Lỗi khi xóa:", error.response || error);
      if (error.response?.status === 400) {
        toast.error("Không thể xóa sách vì đang được mượn");
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
      fetchBook(newPage);
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
              : "/placeholder.png"
          }
          className="w-[145px] h-[205px] object-cover"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold">{book.tenSach || "Không có tiêu đề"}</p>
          <p className="italic">{book.tenTacGias?.join(", ") || "Không có tác giả"}</p>
          <p>Ngôn ngữ: {book.ngonNgu || "Không xác định"}</p>
          <p>Tái bản: {book.taiBan || "Không xác định"}</p>
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
              <select
                onChange={(e) => setMode(e.target.value)}
                value={mode}
                className="border border-gray-300 bg-gray rounded-md shadow p-2 font-thin italic"
              >
                <option value="all">Tất cả</option>
                <option value="tenSach">Tên sách</option>
                <option value="maNXB">Nhà xuất bản</option>
                <option value="namXB">Năm xuất bản</option>
                <option value="ngonNgu">Ngôn ngữ</option>
                <option value="tinhTrang">Tình trạng</option>
              </select>
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-10 p-3 text-black bg-white shadow font-thin italic"
              />
              <select
                onChange={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
                className="border border-gray-300 bg-white rounded-md shadow p-2 italic"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Đầy đủ sách">Đầy đủ sách</option>
                <option value="Thiếu sách">Thiếu sách</option>
                <option value="Hết sách">Hết sách</option>
              </select>
              <Button
                onClick={handleSearch}
                className="w-10 h-10 bg-[#062D76] hover:bg-gray-700 shadow rounded-md"
              >
                <Search className="w-5 h-5" color="white" />
              </Button>
            </div>
            <div className="flex gap-4 ml-5">
              <Button
                onClick={() => router.push("/books/categories")}
                className="w-40 h-10 bg-[#062D76] hover:bg-gray-700 font-bold rounded-[10px]"
              >
                Quản lý thể loại
              </Button>
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
                    : "/placeholder.png"
                }
                className="w-[145px] h-[205px] object-cover"
                onError={(e) => (e.target.src = "/placeholder.png")}
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