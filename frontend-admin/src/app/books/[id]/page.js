"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ArrowUpFromLine, ChevronDown, CircleCheck, Undo2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
import axios from "axios";

// ==== CẤU HÌNH CHUNG CHO AXIOS ====
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.common["Content-Type"] = "application/json";

function EditBookPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const fileInputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Book fields aligned with SachDTO
  const [bookname, setBookname] = useState("");
  const [authors, setAuthors] = useState([]); // List of author names
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [quantity, setQuantity] = useState("");
  const [originQuantity, setOriginQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState([]); // List of genre names
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [reprint, setReprint] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({
    bookname: false,
    authors: false,
    year: false,
    quantity: false,
    price: false,
  });

  // Image state
  const [images, setImages] = useState(
    Array(4).fill({ filePreview: null, selectedFile: null })
  );

  // Genre dropdown
  const [availableGenres, setAvailableGenres] = useState([]);
  const [isGenreListOpen, setIsGenreListOpen] = useState(false);

  // Back navigation
  const handleGoBack = () => router.back();

  const isDeleted = status === "DA_XOA";

  // Fetch book data and genres
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch book details
        const bookResponse = await axios.get(`/api/books/${id}`);
        const data = bookResponse.data;
        setBookname(data.tenSach || "");
        setAuthors(Array.isArray(data.tenTacGias) && data.tenTacGias.length > 0 ? data.tenTacGias : [""]); // Ensure at least one empty author input
        setPublisher(data.tenNXB || "");
        setYear(data.namXB?.toString() || "");
        setQuantity(""); // Reset for additional quantity
        setOriginQuantity(data.soLuong || 0);
        setDescription(data.chuThich || "");
        setGenres(Array.isArray(data.tenTheLoais) ? data.tenTheLoais : []);
        setPrice(data.gia?.toString() || "");
        setStatus(data.tinhTrang || "");
        setReprint(data.taiBan?.toString() || "");

        // Handle images, default to empty array if null
        const bookImages = Array.isArray(data.hinhAnh) ? data.hinhAnh : [];
        setImages((prev) =>
          prev.map((_, idx) => ({
            filePreview: bookImages[idx] || null,
            selectedFile: null,
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle file change for images
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImages((prev) => {
      const arr = [...prev];
      arr[index] = {
        filePreview: URL.createObjectURL(file),
        selectedFile: file,
      };
      return arr;
    });
  };

  // Upload images to backend
  const uploadImages = async () => {
    const uploadedUrls = [];
    for (const img of images) {
      if (img.selectedFile) {
        const formData = new FormData();
        formData.append("file", img.selectedFile);
        try {
          const res = await axios.post("/api/books/upload-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          uploadedUrls.push(res.data.url);
        } catch (err) {
          throw new Error("Upload ảnh thất bại");
        }
      } else if (img.filePreview) {
        uploadedUrls.push(img.filePreview); // Retain existing images
      }
    }
    return uploadedUrls;
  };

  // Validation
  const handleValidation = () => {
    const newErrors = {
      bookname: !bookname.trim(),
      authors: authors.length === 0 || authors.every((author) => !author.trim()),
      year: year && (isNaN(+year) || +year <= 0),
      quantity: quantity && (isNaN(+quantity) || +quantity < 0),
      price: price && (isNaN(+price) || +price <= 0),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!id) {
      toast.error("ID sách không hợp lệ");
      return;
    }
    if (!handleValidation()) {
      toast.error("Vui lòng điền đầy đủ và đúng thông tin");
      return;
    }

    setLoading(true);
    try {
      // Upload new images
      const newImageUrls = await uploadImages();

      // Calculate quantity
      const additionalQuantity = isDeleted ? (+quantity || 0) : (+quantity || 0);
      if (isDeleted && (!quantity || +quantity <= 0)) {
        throw new Error("Số lượng phải lớn hơn 0 khi phục hồi sách");
      }

      // Collect all input data
      const bookUpdates = {
        tenSach: bookname.trim(),
        chuThich: description || "",
        tenTacGias: authors.filter((author) => author.trim()), // Remove empty authors
        tenNXB: publisher || "",
        namXB: year ? +year : 0,
        gia: price ? +price : 0,
        tenTheLoais: genres,
        taiBan: reprint ? +reprint : 0,
        soLuong: isDeleted ? +quantity : originQuantity + additionalQuantity,
        tinhTrang: isDeleted ? "CON_HANG" : status || "CON_HANG",
        hinhAnh: newImageUrls,
      };

      // Send PUT request
      await axios.put(`/api/books/${id}`, bookUpdates);
      toast.success(
        isDeleted
          ? "Sách đã được phục hồi thành công"
          : "Cập nhật sách thành công"
      );
      router.push(`/books`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || err.response?.data?.error || "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding/removing authors
  const handleAuthorChange = (index, value) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  const addAuthor = () => setAuthors([...authors, ""]);
  const removeAuthor = (index) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    } else {
      setAuthors([""]); // Keep at least one empty input
    }
  };

  // Handle adding/removing genres
  const toggleGenre = (genre) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="md:ml-52 flex-1 flex items-center justify-center min-h-screen">
          <ThreeDot
            color="#062D76"
            size="large"
            text="Loading..."
            variant="bounce"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full h-full min-h-screen bg-[#EFF3FB] pb-15">
      <Sidebar />
      <div className="flex w-full flex-col py-6 md:ml-52 relative mt-10 gap-2 items-center px-10">
        {/* Back Button */}
        <div className="absolute top-5 left-5 md:left-57 fixed">
          <Button
            title={"Quay Lại"}
            className="bg-[#062D76] rounded-3xl w-10 h-10"
            onClick={handleGoBack}
          >
            <Undo2 className="w-12 h-12" color="white" />
          </Button>
        </div>

        {/* Book Name */}
        <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
          <p className="font-semibold text-lg mt-3">Tên Sách</p>
          <Input
            type="text"
            placeholder="Nhập tên sách"
            className={`font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white ${
              errors.bookname ? "border-red-500" : ""
            }`}
            disabled={isDeleted}
            value={bookname}
            onChange={(e) => setBookname(e.target.value)}
          />
        </div>

        {/* Authors */}
        <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
          <p className="font-semibold text-lg mt-3">Tác Giả</p>
          {authors.map((author, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="text"
                placeholder="Nhập tên tác giả"
                className={`font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white ${
                  errors.authors ? "border-red-500" : ""
                }`}
                disabled={isDeleted}
                value={author}
                onChange={(e) => handleAuthorChange(index, e.target.value)}
              />
              <Button
                className="bg-red-500 text-white"
                onClick={() => removeAuthor(index)}
                disabled={isDeleted}
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button
            className="bg-green-500 text-white w-32"
            onClick={addAuthor}
            disabled={isDeleted}
          >
            Thêm Tác Giả
          </Button>
        </div>

        {/* Publisher and Year */}
        <div className="flex w-full justify-between gap-10">
          <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Năm Xuất Bản</p>
            <Input
              type="number"
              placeholder="Nhập năm xuất bản"
              className={`font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white ${
                errors.year ? "border-red-500" : ""
              }`}
              disabled={isDeleted}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Nhà Xuất Bản</p>
            <Input
              type="text"
              placeholder="Nhập tên nhà xuất bản"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              disabled={isDeleted}
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
            />
          </div>
        </div>

        {/* Quantity and Genres */}
        <div className="flex w-full justify-between gap-10">
          <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Số Sách Thêm</p>
            <Input
              type="number"
              placeholder="Nhập số sách muốn thêm"
              className={`font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white ${
                errors.quantity ? "border-red-500" : ""
              }`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px] relative">
            <p className="font-semibold text-lg mt-3">Thể Loại</p>
            <Button
              className="bg-white text-black rounded-lg w-full h-10 hover:bg-gray-300 flex justify-between"
              onClick={() => setIsGenreListOpen(!isGenreListOpen)}
              disabled={isDeleted}
            >
              {genres.length > 0 ? genres.join(", ") : "Chọn Thể Loại"}
              <ChevronDown className="w-12 h-12" color="#062D76" />
            </Button>
            {isGenreListOpen && (
              <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg max-h-40 overflow-y-auto">
                {availableGenres.map((genre, index) => (
                  <Button
                    key={index}
                    className={`flex justify-start block w-full px-4 py-2 text-left text-black hover:bg-gray-300 items-center gap-2 ${
                      genres.includes(genre) ? "bg-gray-200" : "bg-white"
                    }`}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price and Reprint */}
        <div className="flex w-full justify-between gap-10">
          <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Đơn Giá (VND)</p>
            <Input
              type="number"
              placeholder="Nhập đơn giá"
              className={`font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white ${
                errors.price ? "border-red-500" : ""
              }`}
              disabled={isDeleted}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Tái Bản</p>
            <Input
              type="number"
              placeholder="Nhập số lần tái bản"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              disabled={isDeleted}
              value={reprint}
              onChange={(e) => setReprint(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
          <p className="font-semibold text-lg mt-3">Mô Tả</p>
          <Input
            type="text"
            placeholder="Nhập mô tả sách"
            className="font-semibold rounded-lg w-full h-10 flex px-5 bg-white"
            disabled={isDeleted}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Images */}
        <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
          <p className="font-semibold text-lg mt-3">Hình ảnh</p>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="flex flex-col space-y-3">
                {img.filePreview ? (
                  <img
                    src={img.filePreview}
                    className="w-[290px] h-[410px] rounded-lg"
                    width={145}
                    height={205}
                    alt={`Ảnh ${index + 1}`}
                  />
                ) : (
                  <div className="w-[290px] h-[410px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-700">
                    Không có hình ảnh
                  </div>
                )}
                <Button
                  className="flex w-[290px] bg-[#062D76]"
                  onClick={() => fileInputRefs[index].current.click()}
                  disabled={isDeleted}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  {index === 0 ? "Tải Ảnh Bìa" : "Tải Ảnh Xem Trước"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(index, e)}
                    ref={fileInputRefs[index]}
                  />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full bottom-0 px-10 left-0 md:left-52 md:w-[calc(100%-208px)] fixed h-18 bg-white flex items-center justify-between">
          <div></div>
          <Button
            title={"Hoàn Tất"}
            className="rounded-3xl w-40 h-12 bg-[#062D76]"
            onClick={handleSubmit}
          >
            <CircleCheck className="w-12 h-12" color="white" />
            Hoàn Tất
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditBookPage;