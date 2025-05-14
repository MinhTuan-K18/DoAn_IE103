"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useParams } from "next/navigation";
import { CalendarClock, Check, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
import Sidebar from "@/app/components/sidebar/Sidebar";
import axios from "axios";
const Page = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [childBookList, setChildBookList] = useState([]);
  const [filterBooks, setFilterBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resBook = await fetch(`http://localhost:8080/api/book/${id}`);
        if (!resBook.ok) throw new Error(`Lỗi khi lấy sách: ${resBook.status}`);
        const data = await resBook.json();
        setBook(data);

        const resChild = await fetch(`http://localhost:8080/api/bookchild/book/${id}`);
        if (!resChild.ok) throw new Error(`Lỗi khi lấy sách con: ${resChild.status}`);
        const children = await resChild.json();
        setChildBookList(children);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  const handleAddChild = async () => {
    setActionLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/api/bookchild/book/${id}/add`);
      const newChildBook = response.data;
  
      toast.success("Đã tạo sách con mới");
  
      setChildBookList(prev => [
        ...prev,
        {
          id: newChildBook.id, 
          status: "AVAILABLE",
        }
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Không thể thêm sách con");
    } finally {
      setActionLoading(false);
    }
  };
  

 const handleDeleteChild = async (childId) => {
     setActionLoading(true);
     try {
       await axios.delete(`http://localhost:8080/api/bookchild/${childId}`);
       toast.success("Xóa sách con thành công");
       setChildBookList(prev =>
        prev.map(child =>
          child.id === childId ? { ...child, status: "NOT_AVAILABLE" } : child
        )
      );
      
     } catch {
       toast.error("Xóa thất bại");
     } finally { setActionLoading(false); }
 };
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const result = childBookList.filter(cb => cb.id.toString() === searchQuery.trim());
      if (result.length === 0) toast.error("Không tìm thấy kết quả");
      setFilterBooks(result);
    } else {
      setFilterBooks([]);
    }
  };

  const borrowedCount = childBookList.filter(cb => cb.status === 'BORROWED').length;
  const availableCount = book ? book.tongSoLuong - borrowedCount : 0;

  const BookCard = ({ book }) => (
    <div className="flex bg-white w-full rounded-lg shadow-lg p-6 gap-8">
      <img
        src={book.hinhAnh?.[0] || '/placeholder.png'}
        className="w-64 h-96 object-cover rounded-md"
      />
      <div className="flex flex-col gap-3 flex-1 text-sm md:text-base">
        <p><strong>ID:</strong> {book.maSach}</p>
        <p><strong>Tên sách:</strong> {book.tenSach}</p>
       {/* <p><strong>Mô tả:</strong> {book.moTa}</p>*/}
        <p><strong>Tác giả:</strong> {book.tenTacGia}</p>
        <p><strong>Nhà xuất bản:</strong> {book.nxb}</p>
        <p><strong>Năm xuất bản:</strong> {book.nam}</p>
        <p><strong>Tổng số lượng:</strong> {book.tongSoLuong}</p>
        <p><strong>Còn sẵn:</strong> {availableCount}</p>
        <p><strong>Thể loại chính:</strong> {book.categoryParentName}</p>
        <p><strong>Thể loại phụ:</strong> {book.categoryChildName}</p>
        <p><strong>Đã mượn:</strong> {book.soLuongMuon}</p>
        <p><strong>Đã xóa:</strong> {book.soLuongXoa}</p>
      </div>
    </div>
  );

  const ChildBookCard = ({ book }) => (
    <div className="flex bg-white rounded-lg shadow p-4 items-center justify-between">
      <div className="flex items-center gap-2 font-medium">
        <span>ID con: {book.id}</span>
        {book.status === 'AVAILABLE' && <Check className="w-5 h-5 text-green-500" />}
        {book.status === 'BORROWED' && <CalendarClock className="w-5 h-5 text-yellow-500" />}
        {book.status === 'NOT_AVAILABLE' && <X className="w-5 h-5 text-red-500" />}
      </div>
      <Button
        disabled={actionLoading}
        onClick={() => handleDeleteChild(book.id)}
        size="sm"
        variant="destructive"
      >
        Xóa
      </Button>
    </div>
  );
  

  if (loading) return (
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
        <div className="flex mb-6">
          <Input
            placeholder="Tìm kiếm sách con theo ID"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 h-10 px-4 rounded-lg"
          />
          <Button onClick={handleSearch} className="ml-4 w-12 h-10 bg-[#062D76] hover:bg-gray-700">
            <Search className="w-6 h-6 text-white" />
          </Button>
        </div>
        {/* Book details */}
        {book && <BookCard book={book} />}
        <div className="mt-6">
      </div>
        {/* Child books grid */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {(filterBooks.length ? filterBooks : childBookList).map(cb => (
            <ChildBookCard key={cb.id} book={cb} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
