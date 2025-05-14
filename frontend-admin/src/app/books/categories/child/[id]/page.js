"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from '@/app/components/sidebar/Sidebar';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Undo2, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ThreeDot } from 'react-loading-indicators';

export default function EditCategoryChildPage() {
  const router = useRouter();
  const { id } = useParams();
  const [child, setChild] = useState({ id: '', name: '', parentId: null, parentName: '' });
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // id->string
  useEffect(() => {
    const handlePopState = () => {
      router.replace("/books/categories");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);


  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/category-child/${id}`);
        setChild(res.data);
        setName(res.data.name);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục con:", err);
        toast.error('Không thể tải danh mục con');
        router.replace("/books/categories"); 
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const save = async () => {
    if (!name.trim()) return toast.error('Nhập tên danh mục con');
    try {
      await axios.patch(
        `http://localhost:8080/api/category-child/${id}`,
        { name }
      );
      toast.success('Cập nhật thành công');
      router.replace('/books/categories'); 
    } catch (err) {
      console.error("Lỗi khi cập nhật danh mục con:", err);
      toast.error('Cập nhật thất bại');
    }
  };

  const deleteChild = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/category-child/${deleteTarget.id}`);
      toast.success('Xóa danh mục con thành công');
      router.replace('/books/categories');
    } catch (err) {
      console.error("Lỗi khi xóa danh mục con:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        fullError: err.toString(),
      });
      let errorMessage = "Xóa danh mục con thất bại";
      if (err.response?.data) {
        const errorData = err.response.data;
        const errorString = JSON.stringify(errorData).toLowerCase();
        if (errorString.includes("foreign key constraint") || errorString.includes("referenced from table")) {
          errorMessage = "Không thể xóa vì danh mục con đang liên kết với sách";
        } else if (err.response.status === 400) {
          errorMessage = errorData.message || "Không thể xóa do có dữ liệu liên quan";
        } else if (err.response.status === 404) {
          errorMessage = "Danh mục con không tồn tại";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (err.request) {
        errorMessage = "Không thể kết nối đến server :)).";
      } else {
        errorMessage = "Lỗi không xác định: " + err.message;
      }
      toast.error(errorMessage);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const openDeleteModal = (id, name) => {
    setDeleteTarget({ id, name });
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDot text="Loading" />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-[#EFF3FB]">
      <Sidebar />
      <div className="flex-1 flex flex-col p-8 md:ml-52">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => router.replace('/books/categories')} className="bg-[#062D76] p-2 rounded-full">
            <Undo2 color="white" />
          </Button>
          <h1 className="text-2xl font-bold">Chỉnh sửa danh mục con</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow w-full max-w-full">
          <p className="mb-4 text-gray-700">
            Danh mục cha: <strong>{child.parentName}</strong>
          </p>
          <label className="block font-medium mb-1">Tên danh mục con: </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <div className="flex gap-4 mt-6">
            <Button
              onClick={save}
              className="bg-[#062D76] px-6 py-2 rounded flex items-center gap-2"
            >
              <Save color="white" /> Lưu
            </Button>
            <Button
              onClick={() => openDeleteModal(id, name)}
              className="bg-red-500 px-6 py-2 rounded flex items-center gap-2"
            >
              <Trash2 color="white" /> Xóa
            </Button>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p>
              Bạn có chắc chắn muốn xóa danh mục con{" "}
              <strong>{deleteTarget.name}</strong> không?
            </p>
            <div className="flex gap-4 mt-6 justify-end">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Hủy
              </Button>
              <Button
                onClick={deleteChild}
                className="bg-red-500 px-4 py-2 rounded text-white"
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}