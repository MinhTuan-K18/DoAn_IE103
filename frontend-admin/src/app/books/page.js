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
  const [mode, setMode] = useState("all"); // search mode
  const [statusFilter, setStatusFilter] = useState("all"); // new dropdown filter
  const [bookList, setBookList] = useState([]);
  const [filterBooks, setFilterBooks] = useState([]);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [deleteOne, setDeleteOne] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchBook = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/book");
      setBookList(res.data);
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


  useEffect(() => {
    setSearchQuery("");
    setFilterBooks([]);
  }, [mode]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (mode === "all" && !searchQuery) {
      setFilterBooks([]);
      return;
    }
    if (mode === "all") {
      setFilterBooks(bookList);
      return;
    }
    const params = {};
    if (mode === "title") params.title = searchQuery;
    else if (mode === "author") params.author = searchQuery;
    else if (mode === "category") params.category = searchQuery;
    else if (mode === "publisher") params.publisher = searchQuery;
    else if (mode === "year") {
      if (/^\d{4}$/.test(searchQuery.trim())) params.year = Number(searchQuery.trim());
      else return alert("Nhập năm theo dạng YYYY");
    }
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/book/search",
        { params }
      );
      setFilterBooks(data);
      if (data.length === 0) toast.error("Không tìm thấy kết quả");
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      toast.error("Có lỗi xảy ra khi tìm kiếm");
    }
  };

  const handleDelete = async (book) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8080/api/book/${book.maSach}`);
      const children = data.children || [];
      const hasBorrowed = children.some(c => c.status === 'BORROWED');
      if (hasBorrowed) {
        toast.error("Không thể xoá: vẫn còn sách con đang được mượn!");
        return;
      }
      await axios.delete(`http://localhost:8080/api/book/${book.maSach}`);
      toast.success("Xóa sách thành công");
      await fetchBook();
    } catch (error) {
      console.error("Lỗi khi xóa:", error.response || error);
      toast.error("Xóa sách thất bại");
    } finally {
      setLoading(false);
      setPopUpOpen(false);
      setDeleteOne(null);
    }
  };

  const displayed = (filterBooks.length > 0 ? filterBooks : bookList)
    .filter(b => {
      if (statusFilter === "all") return true;
      return b.trangThai === statusFilter;
    });

  const BookCard = ({ book }) => {
    const isAvailable = book.trangThai === 'CON_SAN';
    return (
      <div className="flex bg-white w-full rounded-lg mt-2 p-5 gap-5 md:gap-10 drop-shadow-lg items-center">
        <img src={book.hinhAnh?.[0] || "/placeholder.png"} className="w-[145px] h-[205px] object-cover" />
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold">{book.tenSach}</p>
          <p className="italic">{book.tenTacGia}</p>
          <p>Tổng số lượng: {book.tongSoLuong}</p>
          <p>Số lượng mượn: {book.soLuongMuon}</p>
          <p>Số lượng xóa: {book.soLuongXoa}</p>
          <p className="font-semibold">
            Trạng thái: <span className={
              book.trangThai === "DA_XOA" ? "text-red-500" :
              book.trangThai === "DA_HET" ? "text-[#5C4033]" :
              "text-green-600"
            }>
              {book.trangThai === "DA_XOA" ? "Đã xóa" :
               book.trangThai === "DA_HET" ? "Đã hết" :
               "Còn sẵn"}
            </span>
          </p>
          <div className="flex justify-end gap-5 md:gap-10">
            <Button onClick={() => router.push(`/books/details/${book.maSach}`)} className="bg-[#062D76] hover:bg-gray-700 w-10 md:w-40 h-10">
              <List className="w-5 h-5" color="white" />
              <p className="hidden md:block text-white">Xem chi tiết</p>
            </Button>
            <Button onClick={() => router.push(`/books/${book.maSach}`)} className="bg-[#062D76] hover:bg-gray-700 w-10 md:w-40 h-10">
              <Pencil className="w-5 h-5" color="white" />
              <p className="hidden md:block text-white">Sửa sách</p>
            </Button>
            {book.trangThai !== "DA_XOA" && (
              <Button onClick={() => { setDeleteOne(book); setPopUpOpen(true); }} className="bg-[#D66766] hover:bg-gray-700 w-10 md:w-40 h-10">
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
          <ThreeDot color="#062D76" size="large" text="Vui lòng chờ" variant="bounce" textColor="#062D76" />
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
                <option value="title">Tên sách</option>
                <option value="author">Tác giả</option>
                <option value="category">Thể loại</option>
                <option value="publisher">Nhà xuất bản</option>
                <option value="year">Năm xuất bản</option>
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
                <option value="CON_SAN">Còn sẵn</option>
                <option value="DA_HET">Đã hết</option>
                <option value="DA_XOA">Đã xóa</option>
              </select>
              <Button onClick={handleSearch} className="w-10 h-10 bg-[#062D76] hover:bg-gray-700 shadow rounded-md">
                <Search className="w-5 h-5" color="white" />
              </Button>
            </div>
            <div className="flex gap-4 ml-5">
              <Button onClick={() => router.push("/books/categories")} className="w-40 h-10 bg-[#062D76] hover:bg-gray-700 font-bold rounded-[10px]">
                Quản lý thể loại
              </Button>
              <Button onClick={() => router.push("/books/addBook")} className="w-40 h-10 bg-[#062D76] hover:bg-gray-700 font-bold rounded-[10px]">
                <Plus className="w-5 h-5" color="white" />
                Thêm sách mới
              </Button>
            </div>
          </div>
          {displayed.map((book) => (
            <BookCard key={book.maSach} book={book} />
          ))}
        </div>
      )}
      {popUpOpen && deleteOne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-80"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-120">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa sách này không?</p>
            <div className="flex mt-4 gap-5">
              <img src={deleteOne.hinhAnh?.[0]} className="w-[145px] h-[205px] object-cover" />
              <div className="flex flex-col gap-2">
                <p>MaSach: {deleteOne.maSach}</p>
                <p className="font-bold">{deleteOne.tenSach}</p>
                <p className="italic">{deleteOne.tenTacGia}</p>
                <p>Tổng số lượng: {deleteOne.tongSoLuong}</p>
                <p>Số lượng mượn: {deleteOne.soLuongMuon}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <Button onClick={() => setPopUpOpen(false)} className="bg-gray-500 hover:bg-gray-700 text-white">Hủy</Button>
              <Button onClick={() => handleDelete(deleteOne)} className="bg-red-500 hover:bg-red-700 text-white">Xóa</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;