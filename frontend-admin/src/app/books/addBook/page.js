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
  const route = useRouter();
  const handleGoBack = () => {
    route.back();
  };
  const [bookname, setBookname] = useState(""); 
  const [author, setAuthor] = useState(""); 
  const [publisher, setPublisher] = useState(""); 
  const [year, setYear] = useState(""); 
  const [quantity, setQuantity] = useState(""); 
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [category2, setCategory2] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice]     = useState("");

  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const [image, setImage] = useState([
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
  ]);
  const [totalCate, setTotalCate] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [cate2List, setCate2List] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category");
        const data = response.data;
        setTotalCate(data);
        setCateList(data.map(item => item.name));
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh mục");
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    if (category !== "") {
      const selectedCate = totalCate.find(cate => cate.name === category);
      if (selectedCate) {
        setCate2List(selectedCate.children.map(child => child.name));
      } else {
        setCate2List([]);
      }
      setCategory2("");
    }
  }, [category, totalCate]);

  const [isCateListOpen, setIsCateListOpen] = useState(false);
  const [isCateList2Open, setIsCateList2Open] = useState(false);
  const openCategoryList = () => {
    setIsCateListOpen(!isCateListOpen);
  };
  const openCategory2List = () => {
    setIsCateList2Open(!isCateList2Open);
  };

  const handleFileChange = (number, event) => {
    const file = event.target.files[0];
    setImage((prev) => {
      const updated = [...prev];
      updated[number] = {
        ...updated[number],
        filePreview: URL.createObjectURL(file),
        selectedFile: file,
      };
      return updated;
    });
  };

  const uploadImagesToCloudinary = async () => {
    const formData = new FormData();
    image.forEach((img) => {
      if (img.selectedFile) {
        formData.append("file", img.selectedFile);
      }
    });
    try {
      const res = await axios.post("http://localhost:8080/upload/image", formData);
      return res.data; 
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Upload hình ảnh thất bại");
      throw error;
    }
  };
const handleValidation = () => {
  const newErrors = { ...errors };
  newErrors.bookname = !bookname;
  newErrors.author = !author;
  newErrors.publisher = !publisher;
  newErrors.year = !year;
  newErrors.quantity = !quantity || parseInt(quantity) < 1;
  newErrors.description = !description;
  newErrors.category = !category;
  newErrors.category2 = !category2;

  setErrors(newErrors);
  return !Object.values(newErrors).includes(true);
};

  const handleSubmit = async () => {
    if (
      bookname === "" ||
      author === "" ||
      year === "" ||
      publisher === "" ||
      description === "" ||
      category === "" ||
      category2 === "" ||
      quantity === ""
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (parseInt(quantity) < 1) {
      toast.error("Số lượng sách phải lớn hơn 0");
      return;
    }
    if (weight === "" || isNaN(+weight) || +weight <= 0) {
      toast.error("Nhập trọng lượng (> 0)");
      return;
    }
    if (price === "" || isNaN(+price) || +price <= 0) {
      toast.error("Nhập đơn giá (> 0)");
      return;
    }

    setLoading(true);
    try {
      let finalImageURLs = [];
      if (image.some(img => img.selectedFile)) {
        const newImages = await uploadImagesToCloudinary();
        finalImageURLs = newImages;
      }

      const selectedParent = totalCate.find(cate => cate.name === category);
      if (!selectedParent) {
        toast.error("Thể loại chính không hợp lệ");
        return;
      }
      const selectedChild = selectedParent.children.find(child => child.name === category2);
      if (!selectedChild) {
        toast.error("Thể loại phụ không hợp lệ");
        return;
      }
      const childId = selectedChild.id;

      const bookData = {
        book: {
          tenSach: bookname,
          moTa: description,
          tenTacGia: author,
          nxb: publisher,
          nam: parseInt(year),
          hinhAnh: finalImageURLs,
          trongLuong: parseInt(weight),   
          donGia: parseInt(price),
          categoryChild: { id: childId },
          trangThai: "CON_SAN"
        },
        quantity: parseInt(quantity),
      };

      const res = await axios.post("http://localhost:8080/api/book", bookData);
      toast.success("Thêm sách thành công");
      const newId = res.data.maSach; 
      route.push(`/books/details/${newId}`);
    } catch (error) {
      console.error("Lỗi:", error.message);
      toast.error("Thêm sách thất bại");
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
          {/*Nút Back*/}
          <div className="absolute top-5 left-5 md:left-57 fixed">
            <Button
              title={"Quay Lại"}
              className="bg-[#062D76] rounded-3xl w-10 h-10"
              onClick={handleGoBack}
            >
              <Undo2 className="w-12 h-12" color="white" />
            </Button>
          </div>
          {/*Dòng tên sách*/}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Tên Sách<span className="text-red-500"> *</span></p>
            <Input
              type="text"
              placeholder="Nhập tên sách"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              value={bookname}
              onChange={(e) => setBookname(e.target.value)}
            />
          </div>
          {/*Dòng tên tg*/}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Tên Tác Giả<span className="text-red-500"> *</span></p>
            <Input
              type="text"
              placeholder="Nhập tên tác giả"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          {/*Dòng năm xuất bản và nhà xuất bản */}
          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Năm Xuất Bản<span className="text-red-500"> *</span></p>
              <Input
                type="number"
                placeholder="Nhập năm xuất bản"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Nhà Xuất Bản<span className="text-red-500"> *</span></p>
              <Input
                type="text"
                placeholder="Nhập tên nhà xuất bản"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
              />
            </div>
          </div>
          {/*Dòng số lượng và thể loại */}
          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Số lượng<span className="text-red-500"> *</span></p>
              <Input
                type="number"
                placeholder="Nhập số lượng"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px] space-y-2 relative inline-block text-left">
              <p className="font-semibold text-lg mt-3">Thể Loại Chính<span className="text-red-500"> *</span></p>
              <Button
                title={"Thể Loại Chính"}
                className="bg-white text-black rounded-lg w-full h-10 hover:bg-gray-300 flex justify-between"
                onClick={openCategoryList}
              >
                {category !== "" ? category : "Chọn Thể Loại Chính"}
                <ChevronDown className="w-12 h-12" color="#062D76" />
              </Button>
              {isCateListOpen && (
                <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg">
                  {cateList?.map((cate, index) => (
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
            {/*Thể loại 2*/}
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px] space-y-2 relative inline-block text-left">
              <p className="font-semibold text-lg mt-3">Thể Loại Phụ<span className="text-red-500"> *</span></p>
              <Button
                title={"Thể Loại Phụ"}
                className="bg-white text-black rounded-lg w-full h-10 hover:bg-gray-300 flex justify-between"
                onClick={openCategory2List}
              >
                {category2 !== "" ? category2 : "Chọn Thể Loại Phụ"}
                <ChevronDown className="w-12 h-12" color="#062D76" />
              </Button>
              {isCateList2Open && (
                <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg">
                  {cate2List?.map((cate, index) => (
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
                  <p className="font-semibold text-lg mt-3">Trọng Lượng (gram)<span className="text-red-500"> *</span></p>
                  <Input
                      type="number"
                      placeholder="Nhập trọng lượng"
                      className="font-semibold rounded-lg w-full h-10 px-5 bg-white"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
              </div>
              <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
                    <p className="font-semibold text-lg mt-3">Đơn Giá (VND)<span className="text-red-500"> *</span></p>
                    <Input
                      type="number"
                      placeholder="Nhập đơn giá"
                      className="font-semibold rounded-lg w-full h-10 px-5 bg-white"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
              </div>
            </div> 
        

          {/*Dòng mô tả*/}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Mô Tả<span className="text-red-500"> *</span></p>
            <Input
              type="text"
              placeholder="Nhập mô tả sách"
              className="font-semibold rounded-lg w-full h-10 flex px-5 bg-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/*Dòng hình ảnh*/}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Hình ảnh</p>
            <div className="grid grid-cols-4 gap-4">
              {/*Cột ảnh bìa*/}
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
                    className="hidden input-new-file"
                    onChange={(e) => handleFileChange(0, e)}
                    ref={fileInputRef}
                  />
                </Button>
              </div>
              {/*Cột ảnh 1*/}
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
                    accept="image/*"
                    className="hidden input-new-file"
                    onChange={(e) => handleFileChange(1, e)}
                    ref={fileInputRef1}
                  />
                </Button>
              </div>
              {/*Cột ảnh 2*/}
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
                    accept="image/*"
                    className="hidden input-new-file"
                    onChange={(e) => handleFileChange(2, e)}
                    ref={fileInputRef2}
                  />
                </Button>
              </div>
              {/*Cột ảnh 3*/}
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
                    accept="image/*"
                    className="hidden input-new-file"
                    onChange={(e) => handleFileChange(3, e)}
                    ref={fileInputRef3}
                  />
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full bottom-0 px-10 left-0 md:left-52 md:w-[calc(100%-208px)] fixed h-18 bg-white flex items-center justify-between">
            {/*Control Bar*/}
            <div></div>
            <Button
              title={"Hoàn Tất"}
              className={`rounded-3xl w-40 h-12 bg-[#062D76]`}
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