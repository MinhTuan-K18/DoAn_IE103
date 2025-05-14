
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatBotButton from "../components/ChatBoxButton";
import BookCard from "../components/BookCard";
import LeftSideBar from "../components/LeftSideBar";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
});

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [children, setChildren] = useState([]);
  const [books, setBooks] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeCategoryChildId, setActiveCategoryChildId] = useState(null);
  const [loadingBooks, setLoadingBooks] = useState(false);

  useEffect(() => {
    api
      .get("/category")
      .then((res) => {
        const cats = res.data;
        setCategories(cats);
        if (cats.length > 0) {
          setActiveCategoryId(cats[0].id);
        }
      })
      .catch((err) => console.error("Lỗi fetch categories:", err));
  }, []);

  useEffect(() => {
    if (!activeCategoryId) return;

    api
      .get(`/category-child/category/${activeCategoryId}`)
      .then((res) => {
        const childs = res.data;
        setChildren(childs);
        if (childs.length > 0) {
          setActiveCategoryChildId(childs[0].id);
        }
      })
      .catch((err) => console.error("Lỗi fetch category-child:", err));
  }, [activeCategoryId]);


  useEffect(() => {
    if (!activeCategoryChildId) return;
  
    setLoadingBooks(true);
    api
      .get(`/book/category/${activeCategoryChildId}`)
      .then((res) => {
        const filteredBooks = res.data.filter((b) => b.trangThai !== "DA_XOA");
        setBooks(filteredBooks);
      })
      .catch((err) => console.error("Lỗi fetch books:", err))
      .finally(() => setLoadingBooks(false));
  }, [activeCategoryChildId]);
  

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <main className="pt-16 flex">
        <LeftSideBar />

        <section className="flex-1 pr-5 md:pl-64 ml-5 my-auto mt-2">
          {/* Chọn category cha */}
          <div className="flex gap-4 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-4 py-2 rounded-lg ${
                  activeCategoryId === cat.id
                    ? "bg-sky-900 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Chọn category con */}
          {children.length > 0 && (
            <div className="flex gap-4 mb-6">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setActiveCategoryChildId(child.id)}
                  className={`px-4 py-2 rounded-lg ${
                    activeCategoryChildId === child.id
                      ? "bg-sky-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}

          {/* Danh sách sách */}
          <div className="bg-white rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-4">
              {children.find((c) => c.id === activeCategoryChildId)?.name ||
                "Sách"}
            </h2>

            {loadingBooks ? (
              <p>Đang tải sách...</p>
            ) : (
              <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                {books.map((book) => (
                  <BookCard
                    key={book.maSach}
                    id={book.maSach}
                    imageSrc={book.hinhAnh?.[0] || "/placeholder.png"}
                    status={book.trangThai} 
                    available={book.trangThai === "CON_SAN"|| book.trangThai === "DA_HET"}
                    title={book.tenSach}
                    author={book.tenTacGia}
                    publisher={`${book.nxb} (${book.nam})`}
                    borrowCount={book.soLuongMuon}
                  />
                ))}
                {books.length === 0 && (
                  <p className="col-span-full text-center text-gray-500">
                    Không có sách nào.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <ChatBotButton />
      </main>
    </div>
  );
}
