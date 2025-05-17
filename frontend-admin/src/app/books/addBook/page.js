"use client";

import Sidebar from "@/app/components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ArrowUpFromLine, CircleCheck, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
import axios from "axios";

function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Trạng thái cho các trường nhập liệu
  const [tenSach, setTenSach] = useState("");
  const [tenTacGiasInput, setTenTacGiasInput] = useState(""); // Chuỗi tác giả nhập vào
  const [tenNXB, setTenNXB] = useState("");
  const [namXB, setNamXB] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [chuThich, setChuThich] = useState("");
  const [gia, setGia] = useState("");
  const [tenTheLoaisInput, setTenTheLoaisInput] = useState(""); // Chuỗi thể loại nhập vào
  const [taiBan, setTaiBan] = useState(""); // Số lần tái bản

  // Trạng thái cho hình ảnh
  const fileInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [image, setImage] = useState([
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
  ]);

  // Xử lý chọn file hình ảnh
  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setImage((prev) => {
        const updated = [...prev];
        updated[index] = {
          filePreview: URL.createObjectURL(file),
          selectedFile: file,
        };
        return updated;
      });
    }
  };

  // Upload hình ảnh lên backend
  const uploadImages = async () => {
    const urls = [];
    for (const img of image) {
      if (img.selectedFile) {
        const formData = new FormData();
        formData.append("file", img.selectedFile);
        try {
          const res = await axios.post(
            "http://localhost:8080/api/books/upload-image",
            formData
          );
          urls.push(res.data.url);
        } catch (error) {
          console.error("Error uploading image:", error);
          throw new Error("Upload hình ảnh thất bại");
        }
      }
    }
    return urls;
  };

  // Tính toán tình trạng dựa trên số lượng
  const calculateTinhTrang = (soLuong) => {
    const qty = parseInt(soLuong) || 0;
    if (qty === 0) return "Hết sách";
    if (qty < 20) return "Thiếu sách";
    return "Đầy đủ sách";
  };

  // Kiểm tra dữ liệu đầu vào
  const validateInput = () => {
    if (!tenSach) {
      toast.error("Vui lòng nhập tên sách");
      return false;
    }
    const tenTacGias = tenTacGiasInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    if (tenTacGias.length === 0) {
      toast.error("Vui lòng nhập ít nhất một tác giả");
      return false;
    }
    if (!tenNXB.trim()) {
      toast.error("Vui lòng nhập nhà xuất bản");
      return false;
    }
    if (namXB && !/^\d{4}$/.test(namXB)) {
      toast.error("Vui lòng nhập năm xuất bản hợp lệ (YYYY)");
      return false;
    }
    if (!soLuong || isNaN(soLuong) || soLuong < 0) {
      toast.error("Số lượng phải lớn hơn hoặc bằng 0");
      return false;
    }
    if (!gia || isNaN(gia) || gia <= 0) {
      toast.error("Đơn giá phải lớn hơn 0");
      return false;
    }
    const tenTheLoais = tenTheLoaisInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    if (tenTheLoais.length === 0) {
      toast.error("Vui lòng nhập ít nhất một thể loại");
      return false;
    }
    if (taiBan && (isNaN(taiBan) || taiBan < 0)) {
      toast.error("Số lần tái bản phải là số không âm");
      return false;
    }
    return true;
  };

  // Xử lý submit
  const handleSubmit = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      // Upload hình ảnh
      let hinhAnh = [];
      if (image.some((img) => img.selectedFile)) {
        hinhAnh = await uploadImages();
      }

      // Tính toán tinhTrang
      const tinhTrang = calculateTinhTrang(soLuong);

      // Chuẩn bị dữ liệu gửi API
      const bookData = {
        tenSach,
        gia: parseInt(gia),
        tenNXB: tenNXB.trim(),
        namXB: namXB ? parseInt(namXB) : null,
        soLuong: parseInt(soLuong),
        chuThich,
        tinhTrang,
        tenTacGias: tenTacGiasInput
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        tenTheLoais: tenTheLoaisInput
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        taiBan: taiBan ? parseInt(taiBan) : null,
        hinhAnh,
      };

      // Gửi yêu cầu POST
      const res = await axios.post("http://localhost:8080/api/books", bookData);
      toast.success("Thêm sách thành công");
      router.push(`/books/details/${res.data.maSach}`);
      console.log("Dữ liệu gửi:", bookData);
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error);
      const errorMessage =
        error.response?.data?.error || "Thêm sách thất bại: " + error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
    router.back();
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-row w-full h-full min-h-screen bg-[#EFF3FB] pb-15">
      <Sidebar />
      {loading ? (
        <div className="flex md:ml-52 w-full h-screen justify-center items-center">
          <ThreeDot
            color="#062D76"
            size="large"
            text="Vui lòng chờ"
            variant="bounce"
            textColor="#062D76"
          />
        </div>
      ) : (
        <div className="flex w-full flex-col py-6 md:ml-52 relative mt-10 gap-2 items-center px-10">
          {/* Nút Back */}
          <div className="absolute top-5 left-5 md:left-57 fixed">
            <Button
              title="Quay Lại"
              className="bg-[#062D76] rounded-3xl w-10 h-10"
              onClick={handleGoBack}
            >
              <Undo2 className="w-12 h-12" color="white" />
            </Button>
          </div>

          {/* Tên sách */}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">
              Tên Sách<span className="text-red-500"> *</span>
            </p>
            <Input
              type="text"
              placeholder="Nhập tên sách"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              value={tenSach}
              onChange={(e) => setTenSach(e.target.value)}
            />
          </div>

          {/* Tác giả */}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">
              Tác Giả<span className="text-red-500"> *</span>
            </p>
            <Input
              type="text"
              placeholder="Nhập tên tác giả, cách nhau bằng dấu phẩy"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              value={tenTacGiasInput}
              onChange={(e) => setTenTacGiasInput(e.target.value)}
            />
          </div>

          {/* Nhà xuất bản và năm xuất bản */}
          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">
                Nhà Xuất Bản<span className="text-red-500"> *</span>
              </p>
              <Input
                type="text"
                placeholder="Nhập tên nhà xuất bản"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={tenNXB}
                onChange={(e) => setTenNXB(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Năm Xuất Bản</p>
              <Input
                type="number"
                placeholder="Nhập năm xuất bản"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={namXB}
                onChange={(e) => setNamXB(e.target.value)}
              />
            </div>
          </div>

          {/* Số lượng và tái bản */}
          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">
                Số Lượng<span className="text-red-500"> *</span>
              </p>
              <Input
                type="number"
                placeholder="Nhập số lượng"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={soLuong}
                onChange={(e) => setSoLuong(e.target.value)}
              />
              <p className="text-sm text-gray-600">
                Tình trạng: {calculateTinhTrang(soLuong)}
              </p>
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Tái Bản</p>
              <Input
                type="number"
                placeholder="Nhập số lần tái bản"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={taiBan}
                onChange={(e) => setTaiBan(e.target.value)}
              />
            </div>
          </div>

          {/* Đơn giá và thể loại */}
          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">
                Đơn Giá (VND)<span className="text-red-500"> *</span>
              </p>
              <Input
                type="number"
                placeholder="Nhập đơn giá"
                className="font-semibold rounded-lg w-full h-10 px-5 bg-white"
                value={gia}
                onChange={(e) => setGia(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">
                Thể Loại<span className="text-red-500"> *</span>
              </p>
              <Input
                type="text"
                placeholder="Nhập thể loại, cách nhau bằng dấu phẩy"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={tenTheLoaisInput}
                onChange={(e) => setTenTheLoaisInput(e.target.value)}
              />
            </div>
          </div>

          {/* Chú thích */}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Chú Thích</p>
            <Input
              type="text"
              placeholder="Nhập chú thích cho sách"
              className="font-semibold rounded-lg w-full h-10 flex px-5 bg-white"
              value={chuThich}
              onChange={(e) => setChuThich(e.target.value)}
            />
          </div>

          {/* Hình ảnh */}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Hình Ảnh</p>
            <div className="grid grid-cols-4 gap-4">
              {image.map((img, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  {img.filePreview ? (
                    <img
                      src={img.filePreview}
                      className="w-[290px] h-[410px] rounded-lg"
                      width={145}
                      height={205}
                      alt={`Ảnh ${index === 0 ? "Bìa" : `Xem Trước ${index}`}`}
                    />
                  ) : (
                    <div className="w-[290px] h-[410px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-700">
                      Không có hình ảnh
                    </div>
                  )}
                  <Button
                    className="flex w-[290px] bg-[#062D76]"
                    onClick={() => fileInputRefs[index].current.click()}
                  >
                    <ArrowUpFromLine className="w-12 h-12" color="white" />
                    Tải {index === 0 ? "Ảnh Bìa" : "Ảnh Xem Trước"}
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

          {/* Control Bar */}
          <div className="w-full bottom-0 px-10 left-0 md:left-52 md:w-[calc(100%-208px)] fixed h-18 bg-white flex items-center justify-between">
            <div></div>
            <Button
              title="Hoàn Tất"
              className="rounded-3xl w-40 h-12 bg-[#062D76]"
              onClick={handleSubmit}
            >
              <CircleCheck className="w-12 h-12" color="white" />
              Hoàn Tất
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
