"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  ArrowUpFromLine,
  ChevronDown,
  CircleCheck,
  Undo2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
import axios from "axios";

// ==== CẤU HÌNH CHUNG CHO AXIOS ====
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.common["Content-Type"] = "application/json";

function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);

  const [bookname, setBookname] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [quantity, setQuantity] = useState("");
  const [originQuantity, setOriginQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [category2, setCategory2] = useState(null);
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  const [errors, setErrors] = useState({
    year: false,
    quantity: false,
    weight: false,
    price: false,
  });

  // State ảnh
  const [image, setImage] = useState(
    Array(4).fill({ filePreview: null, selectedFile: null })
  );

  // Danh sách categories
  const [totalCate, setTotalCate] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [cate2List, setCate2List] = useState([]);

  // Dropdown
  const [isCateListOpen, setIsCateListOpen] = useState(false);
  const [isCateList2Open, setIsCateList2Open] = useState(false);

  const openCategoryList = () => setIsCateListOpen((o) => !o);
  const openCategory2List = () => setIsCateList2Open((o) => !o);

  // Refs
  const isFirstRender = useRef(true);
  const fileRefs = [useRef(), useRef(), useRef(), useRef()];

  // Back
  const handleGoBack = () => router.back();

  const isDeleted = status === "DA_XOA";



  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // categories
        const cats = (await axios.get("/api/category")).data;
        setTotalCate(cats);
        setCateList(cats.map((c) => c.name));

        const data = (await axios.get(`/api/book/${id}`)).data;
        setStatus(data.trangThai || "");
        setBookname(data.tenSach || "");
        setAuthor(data.tenTacGia || "");
        setPublisher(data.nxb || "");
        setYear(data.nam?.toString() || "");
        setQuantity(data.tongSoLuong?.toString() || "");
        setOriginQuantity(data.tongSoLuong || 0);
        setQuantity(""); 
        setDescription(data.moTa || "");
        setCategory(data.categoryChild?.parent?.name || null);
        setCategory2(data.categoryChild?.name || null);
        setWeight(data.trongLuong?.toString() || "");
        setPrice(data.donGia?.toString() || "");

        setImage((prev) =>
          prev.map((_, idx) => ({
            filePreview: data.hinhAnh?.[idx] || null,
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

  // ==== UPDATE cate2List khi thay cate cha ====
  useEffect(() => {
    if (category) {
      const sel = totalCate.find((c) => c.name === category);
      setCate2List(sel?.children.map((ch) => ch.name) || []);
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCategory2(null);
  }, [category, totalCate]);

  // ==== XỬ LÝ FILE CHANGE ====
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage((prev) => {
      const arr = [...prev];
      arr[index] = {
        filePreview: URL.createObjectURL(file),
        selectedFile: file,
      };
      return arr;
    });
  };

  // ==== UPLOAD ẢNH ====
  const uploadImagesToCloudinary = async () => {
    const formData = new FormData();
    let has = false;
    image.forEach((img) => {
      if (img.selectedFile) {
        formData.append("file", img.selectedFile);
        has = true;
      }
    });
    if (!has) return [];
    const res = await axios.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };
  

  const handleValidation = () => {
    const newErrors = {
      year: year && (isNaN(+year) || +year <= 0),
      quantity: quantity && (isNaN(+quantity) || +quantity < 0),
      weight: weight && (isNaN(+weight) || +weight <= 0),
      price: price && (isNaN(+price) || +price <= 0),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };
  


  const handleSubmit = async () => {
    if (!id) {
      toast.error("ID sách không hợp lệ");
      return;
    }
    if (!handleValidation()) {
      toast.error("Vui lòng điền đúng thông tin");
      return;
    }

    if (isDeleted) {
      const newQ = +quantity;
      if (isNaN(newQ) || newQ <= 0) {
        toast.error("Số lượng phải > 0");
        return;
      }
      setLoading(true);
      try {
        await axios.patch(`/api/book/${id}`, { tongSoLuong: newQ });
        toast.success("Sách đã được phục hồi thành công");
        router.back();
      } catch (err) {
        console.error("Lỗi chi tiết:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Lỗi server");
      } finally {
        setLoading(false);
      }
      return;
    }

    const initialData = (await axios.get(`/api/book/${id}`)).data;
    const addQty = +quantity; 
    if (isNaN(addQty) || addQty < 0) {
      toast.error("Số lượng thêm phải >= 0");
      return;
    }
    const bookUpdates = {};

    if (bookname && bookname !== initialData.tenSach) bookUpdates.tenSach = bookname;
    if (description && description !== initialData.moTa) bookUpdates.moTa = description;
    if (author && author !== initialData.tenTacGia) bookUpdates.tenTacGia = author;
    if (publisher && publisher !== initialData.nxb) bookUpdates.nxb = publisher;
    if (year && !isNaN(+year) && +year !== initialData.nam) bookUpdates.nam = +year;
    if (weight && !isNaN(+weight) && +weight !== initialData.trongLuong) bookUpdates.trongLuong = +weight;
    if (price && !isNaN(+price) && +price !== initialData.donGia) bookUpdates.donGia = +price;

    bookUpdates.tongSoLuong = addQty;
    
    
    if (category2) {
      const sel = totalCate.find((c) => c.name === category)?.children.find((ch) => ch.name === category2);
      if (sel && sel.id !== initialData.categoryChild?.id) {
        bookUpdates.categoryChildId = sel.id;
      }
    }

    const updates = {
      book: Object.keys(bookUpdates).length > 0 ? bookUpdates : {},
      quantity: +quantity || initialData.tongSoLuong || 0,
    };
 
    if (Object.keys(bookUpdates).length === 0) {
      toast("Không có thay đổi nào để cập nhật", { icon: "⚠️" });
      return;
    }

   // Upload ảnh nếu có
    let newImgs = [];
    try {
      newImgs = await uploadImagesToCloudinary();
      // Chỉ gán hinhAnh khi upload thực sự có file mới
      if (Array.isArray(newImgs) && newImgs.length > 0) {
        bookUpdates.hinhAnh = newImgs;
      }
    } catch {
      toast.error("Upload ảnh thất bại");
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`/api/book/${id}`, bookUpdates);
      toast.success("Cập nhật sách thành công");
      router.push(`/books/details/${id}`);

    } catch (err) {
      console.error("Lỗi chi tiết:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Lỗi server rồi bà");
    } finally {
      setLoading(false);
    }
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
              title={"Quay Lại"}
              className="bg-[#062D76] rounded-3xl w-10 h-10"
              onClick={handleGoBack}
            >
              <Undo2 className="w-12 h-12" color="white" />
            </Button>
          </div>

          {/* Form nhập liệu */}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Tên Sách</p>
            <Input
              type="text"
              placeholder="Nhập tên sách"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              disabled={isDeleted}
              value={bookname}
              onChange={(e) => setBookname(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Tên Tác Giả</p>
            <Input
              type="text"
              placeholder="Nhập tên tác giả"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              disabled={isDeleted}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Năm Xuất Bản</p>
              <Input
                type="number"
                placeholder="Nhập năm xuất bản"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
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

          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Số Sách Thêm</p>
                <Input
                  type="number"
                  placeholder="Nhập số sách muốn thêm"
                  className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />

            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px] space-y-2 relative inline-block text-left">
              <p className="font-semibold text-lg mt-3">Thể Loại Chính</p>
              <Button
                title={"Thể Loại Chính"}
                className="bg-white text-black rounded-lg w-full h-10 hover:bg-gray-300 flex justify-between"
                onClick={openCategoryList}
                disabled={isDeleted}
              >
                {category || "Chọn Thể Loại Chính"}
                <ChevronDown className="w-12 h-12" color="#062D76" />
              </Button>
              {isCateListOpen && (
                <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg">
                  {cateList.map((cate, index) => (
                    <Button
                      key={index}
                      className="flex justify-start block w-full px-4 py-2 text-left bg-white text-black hover:bg-gray-300 items-center gap-2"
                      onClick={() => {
                        setCategory(cate);
                        setIsCateListOpen(false);
                      }}
                    >
                      {cate}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px] space-y-2 relative inline-block text-left">
              <p className="font-semibold text-lg mt-3">Thể Loại Phụ</p>
              <Button
                title={"Thể Loại Phụ"}
                className="bg-white text-black rounded-lg w-full h-10 hover:bg-gray-300 flex justify-between"
                onClick={openCategory2List}
                disabled={isDeleted}
              >
                {category2 || "Chọn Thể Loại Phụ"}
                <ChevronDown className="w-12 h-12" color="#062D76" />
              </Button>
              {isCateList2Open && (
                <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg">
                  {cate2List.map((cate, index) => (
                    <Button
                      key={index}
                      className="flex justify-start block w-full px-4 py-2 text-left bg-white text-black hover:bg-gray-300 items-center gap-2"
                      onClick={() => {
                        setCategory2(cate);
                        setIsCateList2Open(false);
                      }}
                    >
                      {cate}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Trọng Lượng (gram)</p>
              <Input
                type="number"
                placeholder="Nhập trọng lượng"
                className={`font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white ${errors.weight ? "border-red-500" : ""}`}
                disabled={isDeleted}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Đơn Giá (VND)</p>
              <Input
                type="number"
                placeholder="Nhập đơn giá"
                className={`font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white ${errors.price ? "border-red-500" : ""}`}
                disabled={isDeleted}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            </div> 

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

          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Hình ảnh</p>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col space-y-3">
                {image[0].filePreview ? (
                  <img
                    src={image[0].filePreview}
                    className="w-[290px] h-[410px] rounded-lg"
                    width={145}
                    height={205}
                    alt={"Ảnh Bìa"}
                  />
                ) : (
                  <div className="w-[290px] h-[410px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-700">
                    Không có hình ảnh
                  </div>
                )}
                <Button
                  className="flex w-[290px] bg-[#062D76]"
                  onClick={() => fileInputRef.current.click()}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Bìa
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(0, e)}
                    ref={fileInputRef}
                  />
                </Button>
              </div>
              <div className="flex flex-col space-y-3">
                {image[1].filePreview ? (
                  <img
                    src={image[1].filePreview}
                    className="w-[290px] h-[410px] rounded-lg"
                    width={145}
                    height={205}
                    alt={"Ảnh Xem Trước 1"}
                  />
                ) : (
                  <div className="w-[290px] h-[410px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-700">
                    Không có hình ảnh
                  </div>
                )}
                <Button
                  className="flex w-[290px] bg-[#062D76]"
                  onClick={() => fileInputRef1.current.click()}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Xem Trước
                  <input
                    type="file"
                    disabled={isDeleted}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(1, e)}
                    ref={fileInputRef1}
                  />
                </Button>
              </div>
              <div className="flex flex-col space-y-3">
                {image[2].filePreview ? (
                  <img
                    src={image[2].filePreview}
                    className="w-[290px] h-[410px] rounded-lg"
                    width={145}
                    height={205}
                    alt={"Ảnh Xem Trước 2"}
                  />
                ) : (
                  <div className="w-[290px] h-[410px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-700">
                    Không có hình ảnh
                  </div>
                )}
                <Button
                  className="flex w-[290px] bg-[#062D76]"
                  onClick={() => fileInputRef2.current.click()}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Xem Trước
                  <input
                    type="file"
                    disabled={isDeleted}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(2, e)}
                    ref={fileInputRef2}
                  />
                </Button>
              </div>
              <div className="flex flex-col space-y-3">
                {image[3].filePreview ? (
                  <img
                    src={image[3].filePreview}
                    className="w-[290px] h-[410px] rounded-lg"
                    width={145}
                    height={205}
                    alt={"Ảnh Xem Trước 3"}
                  />
                ) : (
                  <div className="w-[290px] h-[410px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-700">
                    Không có hình ảnh
                  </div>
                )}
                <Button
                  className="flex w-[290px] bg-[#062D76]"
                  onClick={() => fileInputRef3.current.click()}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Xem Trước
                  <input
                    type="file"
                    disabled={isDeleted}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(3, e)}
                    ref={fileInputRef3}
                  />
                </Button>
              </div>
            </div>
          </div>

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
      )}
    </div>
  );
}

export default Page;