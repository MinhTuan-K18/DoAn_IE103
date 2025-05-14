"use client";

import React, { useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import BookCard from "../components/BookCard";
import CollectionCard from "./CollectionCard";
import ServiceHoursCard from "./ServiceHoursCard";
import ChatBotButton from "../components/ChatBoxButton";
import axios from "axios";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const [mode, setMode] = useState("all");

  useEffect(() => {
    if (mode === "all") {
      fetchAll();
    }
  }, [mode]);

  const fetchAll = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/book");
      setBooks(normalize(data));
    } catch (err) {
      console.error(err);
    }
  };
  const normalize = (arr) =>
    arr
      ?.filter((b) => b.trangThai !== "DA_XOA")
      .map((b) => ({
        id: b.maSach,
        imageSrc: b.hinhAnh?.[0] || "",
        status: b.trangThai,
        remaining: b.soLuongCon,
        title: b.tenSach,
        author: b.tenTacGia,
        publisher: b.nxb,
        borrowCount: b.soLuongMuon,
      }));
  

  const handleSearch = async (e) => {
    e.preventDefault();
    if (mode === "all") {
      setQ("");
      return;
    }

    const params = {};
    if (mode === "topBorrowed") {
      params.sortByBorrowCount = true;
    } else if (mode === "author") {
      params.author = q;
    } else if (mode === "category") {
      params.category = q;
    } else if (mode === "publisher") {
      params.publisher = q;
    } else if (mode === "year") {
      if (/^\d{4}$/.test(q.trim())) params.year = Number(q.trim());
      else {
        alert("Nhập năm theo dạng YYYY");
        return;
      }
    }else if (mode === "title") {
      params.title = q;
    }


    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/book/search",
        { params }
      );
      setBooks(normalize(data));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <main className="pt-16 flex">
        <LeftSideBar />
        <section className="flex-1 pr-5 md:pl-64 ml-5 mt-2">
          {/* ===== Thẻ dịch vụ và bộ sưu tập ==== */}
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

          {/* ===== Tìm kiếm ==== */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow backdrop-blur-sm mt-5"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/669888cc237b300e928dbfd847b76e4236ef4b5a?apiKey=…"
              alt="search"
              className="w-6 h-6"
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                mode === "all"
                  ? "Xem tất cả sách"
                  : mode === "topBorrowed"
                  ? "Top mượn nhiều nhất"
                  : mode === "year"
                  ? "Nhập năm (YYYY)…"
                  : mode === "title"
                  ? "Tìm theo tên sách…"
                  : `Tìm theo ${mode === "author" ? "tác giả" : mode === "category" ? "thể loại" : "NXB"}`
              }
              className="flex-1 bg-transparent outline-none"
              disabled={mode === "all" || mode === "topBorrowed"}
            />
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border px-2 py-1 rounded-full"
            >
              <option value="all">Tất cả</option>
              <option value="title">Tên sách</option>
              <option value="author">Tác giả</option>
              <option value="category">Thể loại</option>
              <option value="publisher">NXB</option>
              <option value="year">Năm</option>
              <option value="topBorrowed">Top mượn nhiều</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded-full ml-2"
            >
              Tìm
            </button>
          </form>

          {/* ===== Sách ==== */}
          <section className="mt-5 bg-white rounded-xl p-5">
            <h2 className="inline-block px-4 py-2 text-white bg-[#062D76] rounded-lg">
              Sách
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mt-5">
              {books.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>
          </section>
        </section>
        <ChatBotButton />
      </main>
    </div>
  );
};

export default HomePage;
