"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import * as yup from "yup";
const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // Schema kiểm tra đầu vào
  const registerSchema = yup.object().shape({
    username: yup.string().required("Tên không được để trống"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu không được để trống"),
    dateOfBirth: yup.date().required("Ngày sinh không được để trống"),
    gender: yup
      .string()
      .oneOf(["male", "female", "other"], "Vui lòng chọn giới tính")
      .required("Giới tính không được để trống"),
  });
  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Logging in with:", email, password);
  };

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUpForm,
    formState: { errors: errorsSignUp },
  } = useForm({ resolver: yupResolver(registerSchema) });

  const onSubmitRegister = async (data) => {
    setIsLoading(true);
    try {
      router.push("/");
      toast.success("Đăng ký thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resetSignUpForm();
  }, [resetSignUpForm]);

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="bg-[#EFF3FB] min-h-screen pt-16 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[450px] h-[535px]">
        <div className="flex justify-end">
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">✖</button>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-semibold text-center text-gray-900">ĐĂNG KÝ</h2>
        <p className="text-center text-gray-600 mt-2 mb-2">
          Đã có tài khoản? <a href="/user-login" className="text-blue-500 underline">Đăng nhập</a>
        </p>

        <div className="mt-4">
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 text-gray-700 hover:bg-gray-100">
            <FaFacebook className="text-blue-600 text-xl mr-2" />
            Tiếp tục với Facebook
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 mt-2 text-gray-700 hover:bg-gray-100">
            <FcGoogle className="text-xl mr-2" />
            Tiếp tục với Google
          </button>
        </div>

        {/* Dòng "Hoặc" */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-gray-500 px-3">Hoặc</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <p className="text-center text-gray-600 mt-1 mb-2">
          Nhập địa chỉ email để tạo tài khoản.
        </p>

        {/* Form nhập email/mật khẩu */}
        <form onSubmit={handleSubmitSignUp(onSubmitRegister)}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <Input
              {...registerSignUp("email")}
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Nhập email"
            />
            {errorsSignUp.email && <p className="text-red-500 text-xs">{errorsSignUp.email.message}</p>}
          </div>

          {/* Nút Đăng nhập */}
          <Button type="submit" className="w-full mt-4 bg-[#6CB1DA] text-white hover:bg-[#5A9BCF] transition rounded-full">
            Đăng ký
          </Button>
        </form>
      </div>
    </div>
  );
};
export default Page;