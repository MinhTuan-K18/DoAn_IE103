
"use client";

import Sidebar from "@/app/components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ArrowUpFromLine, ChevronDown, CircleCheck, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
import axios from "axios";

function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleGoBack = () => {
    router.back();

  };

  // Trạng thái cho các trường nhập liệu
  const [tenSach, setTenSach] = useState("");
  const [tenTacGias, setTenTacGias] = useState([""]); // Hỗ trợ nhiều tác giả
  const [maNXB, setMaNXB] = useState("");
  const [namXB, setNamXB] = useState("");
  const [taiBan, setTaiBan] = useState("");
  const [ngonNgu, setNgonNgu] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [chuThich, setChuThich] = useState("");
  const [tinhTrang, setTinhTrang] = useState("Đầy đủ sách");
  const [gia, setGia] = useState("");
  const [tenTheLoais, setTenTheLoais] = useState([]); // Danh sách thể loại

  // Trạng thái cho danh sách nhà xuất bản và thể loại
  const [nxbList, setNxbList] = useState([]);
  const [theLoaiList, setTheLoaiList] = useState([]);
  const [isNxbListOpen, setIsNxbListOpen] = useState(false);
  const [isTheLoaiListOpen, setIsTheLoaiListOpen] = useState(false);

  // Trạng thái cho hình ảnh
  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [image, setImage] = useState([
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
  ]);

  // Lấy danh sách nhà xuất bản và thể loại
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy nhà xuất bản
        const nxbResponse = await axios.get("http://localhost:8080/api/nxb");
        setNxbList(nxbResponse.data);

        // Lấy thể loại
        const theLoaiResponse = await axios.get("http://localhost:8080/api/theloai");
        setTheLoaiList(theLoaiResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, []);

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

  // Upload hình ảnh lên Cloudinary
  const uploadImagesToCloudinary = async () => {
    const formData = new FormData();
    image.forEach((img) => {
      if (img.selectedFile) {
        formData.append("file", img.selectedFile);
      }
    });
    try {
      const res = await axios.post("http://localhost:8080/upload/image", formData);
      return res.data; // Giả sử trả về mảng URL
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Upload hình ảnh thất bại");
      throw error;
    }
  };

  // Xử lý thêm tác giả mới
  const handleAddAuthor = () => {
    setTenTacGias([...tenTacGias, ""]);
  };

  // Cập nhật tên tác giả
  const handleAuthorChange = (index, value) => {
    const updatedAuthors = [...tenTacGias];
    updatedAuthors[index] = value;
    setTenTacGias(updatedAuthors);
  };

  // Xóa tác giả
  const handleRemoveAuthor = (index) => {
    if (tenTacGias.length > 1) {
      setTenTacGias(tenTacGias.filter((_, i) => i !== index));
    }
  };

  // Xử lý chọn thể loại
  const handleTheLoaiSelect = (tenTheLoai) => {
    if (!tenTheLoais.includes(tenTheLoai)) {
      setTenTheLoais([...tenTheLoais, tenTheLoai]);
    }
    setIsTheLoaiListOpen(false);
  };

  // Xóa thể loại
  const handleRemoveTheLoai = (tenTheLoai) => {
    setTenTheLoais(tenTheLoais.filter((item) => item !== tenTheLoai));
  };

  // Kiểm tra dữ liệu đầu vào
  const validateInput = () => {
    if (!tenSach) {
      toast.error("Vui lòng nhập tên sách");
      return false;
    }
    if (tenTacGias.some((author) => !author.trim())) {
      toast.error("Vui lòng nhập đầy đủ tên tác giả");
      return false;
    }
    if (!maNXB) {
      toast.error("Vui lòng chọn nhà xuất bản");
      return false;
    }
    if (!namXB || !/^\d{4}$/.test(namXB)) {
      toast.error("Vui lòng nhập năm xuất bản hợp lệ (YYYY)");
      return false;
    }
    if (!taiBan || isNaN(taiBan) || taiBan < 0) {
      toast.error("Vui lòng nhập tái bản hợp lệ (>= 0)");
      return false;
    }
    if (!ngonNgu) {
      toast.error("Vui lòng nhập ngôn ngữ");
      return false;
    }
    if (!soLuong || isNaN(soLuong) || soLuong < 1) {
      toast.error("Số lượng phải lớn hơn 0");
      return false;
    }
    if (!gia || isNaN(gia) || gia <= 0) {
      toast.error("Đơn giá phải lớn hơn 0");
      return false;
    }
    if (tenTheLoais.length === 0) {
      toast.error("Vui lòng chọn ít nhất một thể loại");
      return false;
    }
    if (!["Hết sách", "Thiếu sách", "Đầy đủ sách"].includes(tinhTrang)) {
      toast.error("Tình trạng không hợp lệ");
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
        hinhAnh = await uploadImagesToCloudinary();
      }

      // Chuẩn bị dữ liệu gửi API
      const bookData = {
        tenSach,
        gia: parseInt(gia),
        nxb: { maNXB: parseInt(maNXB) },
        namXB: parseInt(namXB),
        taiBan: parseInt(taiBan),
        ngonNgu,
        soLuong: parseInt(soLuong),
        chuThich,
        tinhTrang,
        tenTacGias: tenTacGias.filter((author) => author.trim()),
        tenTheLoais,
        hinhAnh,
      };

      // Gửi yêu cầu POST
      const res = await axios.post("http://localhost:8080/api/books", bookData);
      toast.success("Thêm sách thành công");
      router.push(`/books/details/${res.data.maSach}`);
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error);
      toast.error("Thêm sách thất bại: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
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

          {/* Tác giả (hỗ trợ nhiều tác giả) */}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">
              Tác Giả<span className="text-red-500"> *</span>
            </p>
            {tenTacGias.map((author, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder={`Nhập tên tác giả ${index + 1}`}
                  className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                  value={author}
                  onChange={(e) => handleAuthorChange(index, e.target.value)}
                />
                {tenTacGias.length > 1 && (
                  <Button
                    className="bg-red-500 hover:bg-red-700 h-10"
                    onClick={() => handleRemoveAuthor(index)}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            ))}
            <Button
              className="bg-[#062D76] hover:bg-blue-800 w-40 h-10 mt-2"
              onClick={handleAddAuthor}
            >
              Thêm tác giả
            </Button>
          </div>

          {/* Nhà xuất bản và năm xuất bản */}
          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px] relative">
              <p className="font-semibold text-lg mt-3">
                Nhà Xuất Bản<span className="text-red-500"> *</span>
              </p>
              <Button
                className="bg-white text-black rounded-lg w-full h-10 hover:bg-gray-300 flex justify-between"
                onClick={() => setIsNxbListOpen(!isNxbListOpen)}
              >
                {maNXB ? nxbList.find((nxb) => nxb.maNXB === maNXB)?.tenNXB : "Chọn NXB"}
                <ChevronDown className="w-12 h-12" color="#062D76" />
              </Button>
              {isNxbListOpen && (
                <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg mt-1">
                  {nxbList.map((nxb) => (
                    <Button
                      key={nxb.maNXB}
                      className="flex justify-start w-full px-4 py-2 text-left bg-white text-black hover:bg-gray-300"
                      onClick={() => {
                        setMaNXB(nxb.maNXB);
                        setIsNxbListOpen(false);
                      }}
                    >
                      {nxb.tenNXB}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">
                Năm Xuất Bản<span className="text-red-500"> *</span>
              </p>
              <Input
                type="number"
                placeholder="Nhập năm xuất bản"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={namXB}
                onChange={(e) => setNamXB(e.target.value)}
              />
            </div>
          </div>

          {/* Tái bản và ngôn ngữ */}
          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">
                Tái Bản<span className="text-red-500"> *</span>
              </p>
              <Input
                type="number"
                placeholder="Nhập số lần tái bản"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={taiBan}
                onChange={(e) => setTaiBan(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">
                Ngôn Ngữ<span className="text-red-500"> *</span>
              </p>
              <Input
                type="text"
                placeholder="Nhập ngôn ngữ"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={ngonNgu}
                onChange={(e) => setNgonNgu(e.target.value)}
              />
            </div>
          </div>

          {/* Số lượng và tình trạng */}
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
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">
                Tình Trạng<span className="text-red-500"> *</span>
              </p>
              <select
                value={tinhTrang}
                onChange={(e) => setTinhTrang(e.target.value)}
                className="font-semibold rounded-lg w-full h-10 px-5 bg-white border border-gray-300"
              >
                <option value="Đầy đủ sách">Đầy đủ sách</option>
                <option value="Thiếu sách">Thiếu sách</option>
                <option value="Hết sách">Hết sách</option>
              </select>
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
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px] relative">
              <p className="font-semibold text-lg mt-3">
                Thể Loại<span className="text-red-500"> *</span>
              </p>
              <Button
                className="bg-white text-black rounded-lg w-full h-10 hover:bg-gray-300 flex justify-between"
                onClick={() => setIsTheLoaiListOpen(!isTheLoaiListOpen)}
              >
                {tenTheLoais.length > 0 ? tenTheLoais.join(", ") : "Chọn thể loại"}
                <ChevronDown className="w-12 h-12" color="#062D76" />
              </Button>
              {isTheLoaiListOpen && (
                <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg mt-1">
                  {theLoaiList.map((theLoai) => (
                    <Button
                      key={theLoai.maTL}
                      className="flex justify-start w-full px-4 py-2 text-left bg-white text-black hover:bg-gray-300"
                      onClick={() => handleTheLoaiSelect(theLoai.tenTheLoai)}
                    >
                      {theLoai.tenTheLoai}
                    </Button>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {tenTheLoais.map((theLoai, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
                  >
                    {theLoai}
                    <button
                      onClick={() => handleRemoveTheLoai(theLoai)}
                      className="text-red-500 hover:text-red-700"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">
              Mô Tả<span className="text-red-500"> *</span>
            </p>
            <Input
              type="text"
              placeholder="Nhập mô tả sách"
              className="font-semibold rounded-lg w-full h-10 flex px-5 bg-white"
              value={chuThich}
              onChange={(e) => setChuThich(e.target.value)}
            />
          </div>

          {/* Hình ảnh */}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Hình ảnh</p>
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
