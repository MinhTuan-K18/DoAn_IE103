"use client";

import React, { useEffect, useState } from "react";
import BookTableRow from "./BookTableRow";
import axios from "axios";

const BookTable = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/book");
        const normalizedBooks = normalize(response.data);
        setBooks(normalizedBooks);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
      }
    };

    fetchBooks();
  }, []);

  const normalize = (arr) =>
    arr
      ?.filter((b) => b.trangThai !== "DA_XOA")
      .map((b) => ({
        id: b.maSach,
        title: b.tenSach,
        status: b.trangThai,
        quantity: b.tongSoLuong
      }));

  return (
    <section className="flex flex-col mt-6 w-full text-neutral-900 max-md:max-w-full">
      <header className="flex shrink-0 overflow-hidden w-full rounded-t-xl bg-[#05245E] min-h-[3.5rem] shadow-lg max-md:max-w-full">
        <div className="flex basis-1/4 min-w-0 justify-center items-center bg-[#EBF1F9] p-2">
          <h3 className="text-center text-sm font-semibold text-[#062D76]">ID</h3>
        </div>
        <div className="flex basis-1/4 min-w-0 justify-center items-center text-white p-2">
          <h3 className="text-center text-sm font-semibold">Tên sách</h3>
        </div>
        <div className="flex basis-1/4 min-w-0 justify-center items-center bg-[#EBF1F9] p-2">
          <h3 className="text-center text-sm font-semibold text-[#062D76]">Số lượng</h3>
        </div>
        <div className="flex basis-1/4 min-w-0 justify-center items-center text-white p-2">
          <h3 className="text-center text-sm font-semibold">Trạng thái</h3>
        </div>
      </header>

      <div className="flex flex-col gap-1 mt-2.5 bg-white divide-y divide-gray-200">
        {books.map((book) => (
          <BookTableRow
            key={book.id}
            id={book.id}
            title={book.title}
            quantity={book.quantity}
            status={book.status === "CON_SAN" ? "available" : "unavailable"}
          />
        ))}
      </div>

    </section>
  );
};

export default BookTable;