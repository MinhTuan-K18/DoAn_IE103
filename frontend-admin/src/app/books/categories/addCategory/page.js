"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Undo2, Save, PlusCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ThreeDot } from "react-loading-indicators";

export default function AddCategoryPage() {
  const router = useRouter();
  const [categoryData, setCategoryData] = useState({
    name: "",
    children: [{ name: "" }],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      router.replace("/books/categories");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  const handleChange = (e) => {
    setCategoryData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChildChange = (index, value) => {
    const updatedChildren = [...categoryData.children];
    updatedChildren[index].name = value;
    setCategoryData((prev) => ({
      ...prev,
      children: updatedChildren,
    }));
  };

  const handleAddChild = () => {
    setCategoryData((prev) => ({
      ...prev,
      children: [...prev.children, { name: "" }],
    }));
  };

  const handleRemoveChild = (index) => {
    if (categoryData.children.length > 1) {
      const updatedChildren = categoryData.children.filter((_, i) => i !== index);
      setCategoryData((prev) => ({
        ...prev,
        children: updatedChildren,
      }));
    } else {
      toast.error("Phải có ít nhất một danh mục con!");
    }
  };

  const handleSave = async () => {
    if (!categoryData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục cha!");
      return;
    }
    if (categoryData.children.some(child => !child.name.trim())) {
      toast.error("Vui lòng nhập tên cho tất cả danh mục con!");
      return;
    }

    const payload = {
      name: categoryData.name,
      childrenNames: categoryData.children.map(child => child.name),
    };

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/category", payload);
      toast.success("Thêm danh mục thành công");
      router.replace("/books/categories");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      const errorMessage = error.response?.data?.message || "Thêm danh mục thất bại";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDot text="Loading" />
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#EFF3FB]">
      <Sidebar />
      <div className="flex flex-col w-full md:ml-52 px-10 pt-10 gap-6">
        <div className="flex gap-3 items-center">
          <Button
            className="bg-[#062D76] rounded-xl w-10 h-10"
            onClick={() => router.replace("/books/categories")}
            disabled={loading}
          >
            <Undo2 color="white" />
          </Button>
          <h1 className="text-2xl font-bold text-[#062D76]">
            Thêm danh mục mới
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6 w-full">
          <div className="flex flex-col gap-4">
            <label className="font-medium text-[#062D76]">Tên danh mục cha</label>
            <Input
              name="name"
              value={categoryData.name}
              onChange={handleChange}
              placeholder="Nhập tên danh mục cha"
              className="border rounded px-4 py-2 w-full"
              disabled={loading}
            />

            <label className="font-medium text-[#062D76]">Danh mục con</label>
            {categoryData.children.map((child, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={child.name}
                  onChange={(e) => handleChildChange(index, e.target.value)}
                  placeholder={`Danh mục con ${index + 1}`}
                  className="border rounded px-4 py-2 flex-1 w-full"
                  disabled={loading}
                />
                <Button
                  onClick={() => handleRemoveChild(index)}
                  className="bg-red-500 rounded-xl w-10 h-10 flex items-center justify-center"
                  disabled={loading}
                >
                  <Trash2 color="white" size={20} />
                </Button>
              </div>
            ))}
            <Button
              onClick={handleAddChild}
              className="bg-[#A3BFFA] text-[#062D76] rounded-xl px-4 py-2 flex gap-2 w-fit hover:bg-[#BBD2FF]"
              disabled={loading}
            >
              <PlusCircle size={20} />
              Thêm danh mục con
            </Button>
          </div>

          <div className="mt-6">
            <Button
              className="bg-[#062D76] rounded-xl px-6 py-2 flex gap-2"
              onClick={handleSave}
              disabled={loading}
            >
              <Save size={20} />
              Lưu danh mục
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}