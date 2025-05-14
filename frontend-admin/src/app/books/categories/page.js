"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { ChevronDown, PlusCircle, Undo2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        toast.error("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#EFF3FB]">
      <Sidebar />
      <div className="absolute top-5 left-5 md:left-57 fixed">
        <Button
          title={"Quay Lại"}
          className="bg-[#062D76] rounded-3xl w-10 h-10"
          onClick={handleGoBack}
        >
          <Undo2 className="w-12 h-12" color="white" />
        </Button>
      </div>
      <div className="flex flex-col py-6 w-full md:ml-52 px-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold px-8">📚 Danh mục sách</h1>
          <Button
            className="bg-[#062D76] rounded-xl flex gap-2"
            onClick={() => router.push("/books/categories/addCategory")}
          >
            <PlusCircle className="w-5 h-5" />
            Thêm danh mục
          </Button>
        </div>

        {loading ? (
          <p>Đang tải danh mục...</p>
        ) : (
          categories.map((parent) => (
            <div
              key={parent.id}
              className="bg-white rounded-xl shadow p-5 mb-4 cursor-pointer"
              onClick={() => router.push(`/books/categories/${parent.id}`)}
            >
              <div className="text-lg font-semibold flex items-center gap-2 text-[#062D76]">
                <ChevronDown className="w-4 h-4" />
                {parent.name}
              </div>
              <ul className="ml-6 mt-2 list-disc">
                {parent.children.map(child => (
                  <li
                    key={child.id}
                    className="text-gray-700 hover:underline cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      router.push(`/books/categories/child/${child.id}`);
                    }}
                  >
                    {child.name}
                  </li>
                ))}
              </ul>

            </div>
          ))
        )}
      </div>
    </div>
  );
}