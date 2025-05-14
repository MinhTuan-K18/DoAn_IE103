"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Undo2, Save, PlusCircle, Trash2, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ThreeDot } from "react-loading-indicators";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState({
    name: "",
    soLuongDanhMuc: 0,
    children: [],
  });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const didFetch = useRef(false);

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
    if (didFetch.current) return;
    didFetch.current = true;
    (async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/category/${id}`);
        setData({ name: res.data.name, soLuongDanhMuc: res.data.children.length, children: res.data.children });
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
        toast.error("Không thể tải danh mục");
        router.replace("/books/categories");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const updateField = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addChild = async () => {
    if (!newChildName.trim()) {
      toast.error("Vui lòng nhập tên danh mục con");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8080/api/category-child/category/${id}/add`,
        { name: newChildName }
      );
      setData((prev) => ({
        ...prev,
        soLuongDanhMuc: prev.soLuongDanhMuc + 1,
        children: [...prev.children, res.data],
      }));
      toast.success("Thêm danh mục con thành công");
      setShowAddChildModal(false);
      setNewChildName("");
    } catch (err) {
      console.error("Lỗi khi thêm danh mục con:", err);
      toast.error("Thêm danh mục con thất bại do nó đã tồn tại.");
    }
  };

  const save = async () => {
    if (!data.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục cha");
      return;
    }
    try {
      await axios.patch(`http://localhost:8080/api/category/${id}`, {
        name: data.name,
      });
      toast.success("Cập nhật danh mục thành công");
      router.replace("/books/categories");
    } catch (err) {
      console.error("Lỗi khi cập nhật danh mục:", err);
      toast.error("Cập nhật thất bại");
    }
  };

  const deleteParent = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/category/${id}`);
      toast.success("Xóa toàn bộ danh mục thành công");
      router.replace("/books/categories");
    } catch (err) {
      console.error("Lỗi khi xóa danh mục cha:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        fullError: err.toString(),
      });
      let errorMessage = "Xóa danh mục cha thất bại";
      if (err.response?.data) {
        const errorData = err.response.data;
        const errorString = JSON.stringify(errorData).toLowerCase();
        if (errorString.includes("foreign key constraint") || errorString.includes("referenced from table")) {
          errorMessage = "Không thể xóa vì có sách liên quan đến danh mục con";
        } else if (err.response.status === 400) {
          errorMessage = errorData.message || "Không thể xóa do có dữ liệu liên quan";
        } else if (err.response.status === 404) {
          errorMessage = "Danh mục cha không tồn tại";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (err.request) {
        errorMessage = "Không thể kết nối đến server rồi.";
      } else {
        errorMessage = "Lỗi không xác định: " + err.message;
      }
      toast.error(errorMessage);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const deleteChild = async (childId) => {
    try {
      await axios.delete(`http://localhost:8080/api/category-child/${childId}`);
      setData((prev) => ({
        ...prev,
        soLuongDanhMuc: prev.soLuongDanhMuc - 1,
        children: prev.children.filter((x) => x.id !== childId),
      }));
      toast.success("Xóa danh mục con thành công");
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
          errorMessage = "Không thể xóa vì đang có sách liên kết.";
        } else if (err.response.status === 400) {
          errorMessage = errorData.message || "Không thể xóa do có dữ liệu liên quan";
        } else if (err.response.status === 404) {
          errorMessage = "Danh mục con không tồn tại";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (err.request) {
        errorMessage = "Không thể kết nối đến server.";
      } else {
        errorMessage = "Lỗi không xác định: " + err.message;
      }
      toast.error(errorMessage);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const openDeleteModal = (type, id, name) => {
    setDeleteTarget({ type, id, name });
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
      <div className="flex-1 p-8 md:ml-52">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => router.replace("/books/categories")} 
            className="bg-[#062D76] p-2 rounded-full"
          >
            <Undo2 color="white" />
          </Button>
          <h1 className="text-2xl font-bold">Chỉnh sửa danh mục</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow w-full">
          <label className="block font-medium mb-1">Tên danh mục cha:</label>
          <Input
            name="name"
            value={data.name}
            onChange={updateField}
            fullWidth
            className="mb-4"
          />
          <div className="flex gap-4 mt-5">
            <Button
              onClick={save}
              className="bg-[#062D76] px-6 py-2 rounded flex items-center gap-2"
            >
              <Save color="white" /> Lưu
            </Button>
            <Button
              onClick={() => openDeleteModal("parent", null, data.name)}
              className="bg-red-500 px-6 py-2 rounded flex items-center gap-2"
            >
              <Trash2 color="white" /> Xóa
            </Button>
          </div>

          <h2 className="mt-4 font-medium mb-2">
            Danh mục con: ({data.soLuongDanhMuc})
          </h2>
          <ul className="list-disc ml-6">
            {data.children.map((ch) => (
              <li key={ch.id} className="flex items-center gap-2 mb-2">
                <span className="flex-1">{ch.name}</span>
                <Button
                  onClick={() => router.replace(`/books/categories/child/${ch.id}`)} 
                  className="bg-[#6BE5FF] p-2 rounded"
                >
                  <Edit2 color="white" />
                </Button>
                <Button
                  onClick={() => openDeleteModal("child", ch.id, ch.name)}
                  className="bg-red-500 p-2 rounded"
                >
                  <Trash2 color="white" />
                </Button>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => setShowAddChildModal(true)}
            className="mt-4 bg-[#062D76] text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <PlusCircle /> Thêm danh mục con
          </Button>
        </div>
      </div>

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p>
              Bạn có chắc chắn muốn xóa{" "}
              {deleteTarget.type === "parent" ? "danh mục cha" : "danh mục con"}{" "}
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
                onClick={() =>
                  deleteTarget.type === "parent"
                    ? deleteParent()
                    : deleteChild(deleteTarget.id)
                }
                className="bg-red-500 px-4 py-2 rounded text-white"
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thêm danh mục con</h2>
              <Button
                onClick={() => {
                  setShowAddChildModal(false);
                  setNewChildName("");
                }}
                className="p-1"
              >
                <X color="gray" />
              </Button>
            </div>
            <label className="block font-medium mb-1">Tên danh mục con:</label>
            <Input
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              fullWidth
              className="mb-4"
            />
            <div className="flex gap-4 justify-end">
              <Button
                onClick={() => {
                  setShowAddChildModal(false);
                  setNewChildName("");
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Hủy
              </Button>
              <Button
                onClick={addChild}
                className="bg-[#062D76] px-4 py-2 rounded text-white"
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}