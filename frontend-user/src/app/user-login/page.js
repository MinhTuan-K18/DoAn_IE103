"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import GoogleLoginButton from "../components/GoogleLoginButton";
import FacebookLoginButton from "../components/FacebookLoginButton";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/slices/userSlice";

// Function to determine if input is email or phone
const determineInputType = (input) => {
  if (typeof input !== "string" || input.trim() === "") {
    return { type: "invalid", value: input };
  }
  const trimmedInput = input.trim();
  const isEmail = trimmedInput.includes("@");
  const isPhone = /^\d+$/.test(trimmedInput);
  if (isEmail) {
    return { type: "email", value: trimmedInput };
  }
  if (isPhone) {
    return { type: "phone", value: trimmedInput };
  }
  return { type: "invalid", value: trimmedInput };
};

// Schemas for validation
const loginSchema = yup.object().shape({
  identifier: yup
    .string()
    .required("Vui lòng nhập số điện thoại hoặc email")
    .test(
      "valid-identifier",
      "Vui lòng nhập email hợp lệ hoặc số điện thoại",
      (value) => {
        if (!value) return false;
        const { type } = determineInputType(value);
        return type !== "invalid";
      }
    ),
  matKhau: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu không được để trống"),
});

const registerSchema = yup.object().shape({
  tenND: yup.string().required("Tên không được để trống"),
  identifier: yup
    .string()
    .required("Vui lòng nhập số điện thoại hoặc email")
    .test(
      "valid-identifier",
      "Vui lòng nhập email hợp lệ hoặc số điện thoại",
      (value) => {
        if (!value) return false;
        const { type } = determineInputType(value);
        return type !== "invalid";
      }
    ),
  matKhau: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu không được để trống"),
  ngaySinh: yup
    .date()
    .required("Ngày sinh không được để trống")
    .typeError("Ngày sinh phải là ngày hợp lệ"),
  gioiTinh: yup
    .string()
    .oneOf(["Nam", "Nu", "Khac"], "Vui lòng chọn giới tính")
    .required("Giới tính không được để trống"),
});

const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "Mã OTP phải có 6 chữ số")
    .required("Mã OTP không được để trống"),
});

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showOTP, setShowOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form hooks
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLoginForm,
    formState: { errors: errorsLogin },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const {
    register: registerSignUp,
    control,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUpForm,
    formState: { errors: errorsSignUp },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { gioiTinh: "Nam" },
  });

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: errorsOTP },
  } = useForm({
    resolver: yupResolver(otpSchema),
  });

  // Handle registration
  const onSubmitRegister = async (data) => {
    const { type, value } = determineInputType(data.identifier);

    try {
      const payload = {
        username: data.tenND,
        [type]: value,
        password: data.matKhau,
        birthdate: data.ngaySinh.toISOString().split("T")[0], // Định dạng YYYY-MM-DD
        gender: data.gioiTinh,
      };

      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 200) {
        toast.success(result.message || "Đăng ký thành công", {
          style: { background: "#d1fae5", color: "#065f46" },
        });
        if (type === "email") {
          setOtpEmail(value);
          setShowOTP(true);
        } else {
          router.push("/");
        }
      } else {
        throw new Error(result.message || "Đăng ký thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại", {
        style: { background: "#fee2e2", color: "#b91c1c" },
      });
    }
  };

  // Handle OTP verification
  const onSubmitOTP = async (data) => {
    try {
      const verifyResponse = await fetch(
        "http://localhost:8080/api/register/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: otpEmail,
            otp: data.otp,
          }),
        }
      );

      const verifyResult = await verifyResponse.json();

      if (verifyResponse.status === 200) {
        toast.success(verifyResult.message || "Xác thực OTP thành công", {
          style: { background: "#d1fae5", color: "#065f46" },
        });
        setShowOTP(false);
        router.push("/");
      } else {
        throw new Error(verifyResult.message || "Xác thực OTP thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại", {
        style: { background: "#fee2e2", color: "#b91c1c" },
      });
    }
  };

  // Handle login
  const onSubmitLogin = async (data) => {
    const { type, value } = determineInputType(data.identifier);

    try {
      const payload = {
        [type]: value,
        password: data.matKhau,
      };

      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 200) {
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("id", result.data.user.id || "");
        localStorage.setItem("username", result.data.user.username || "");

        Cookies.set("refreshToken", result.data.refreshToken, {
          expires: 7,
          sameSite: "Strict",
        });

        dispatch(
          updateUser({
            ...result.data.user,
            access_token: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          })
        );

        toast.success(result.message || "Đăng nhập thành công", {
          style: { background: "#d1fae5", color: "#065f46" },
        });
        router.push("/");
      } else {
        throw new Error(result.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại", {
        style: { background: "#fee2e2", color: "#b91c1c" },
      });
      router.push("/user-login");
    }
  };

  // Reset forms when switching tabs
  useEffect(() => {
    resetLoginForm();
    resetSignUpForm();
    setShowOTP(false);
  }, [resetLoginForm, resetSignUpForm]);

  return (
    <div className="min-h-screen bg-[#F9FDFF] flex items-center justify-center p-4">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[25vw] border-[#062D76]">
          <CardHeader>
            <CardTitle className="flex justify-center">
              <img src="/images/logo.jpg" alt="logo" className="w-30" />
            </CardTitle>
            <CardDescription className="text-center text-[#062D76]">
              Mỗi cuốn sách là một cánh cửa mở ra thế giới tri thức
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!showOTP ? (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-200">
                  <TabsTrigger value="login" className="cursor-pointer">
                    Đăng nhập
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="cursor-pointer">
                    Đăng ký
                  </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="identifier" className="text-[#086280]">
                        Email hoặc Số điện thoại
                      </Label>
                      <Input
                        id="identifier"
                        type="text"
                        {...registerLogin("identifier")}
                        placeholder="Nhập email hoặc số điện thoại"
                        className="col-span-3 dark:border-gray-400 border-[#0E42D2] placeholder:text-gray-400"
                      />
                      {errorsLogin.identifier && (
                        <p className="text-red-500">
                          {errorsLogin.identifier.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="matKhau" className="text-[#086280]">
                          Mật khẩu
                        </Label>
                        <button
                          type="button"
                          className="flex items-center text-gray-600 text-sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5 ml-1" /> : <Eye className="w-5 h-5 ml-1" />}
                          {showPassword ? "Ẩn" : "Hiện"}
                        </button>
                      </div>
                      <Input
                        id="matKhau"
                        type={showPassword ? "text" : "password"}
                        {...registerLogin("matKhau")}
                        placeholder="Nhập mật khẩu của bạn"
                        className="col-span-3 dark:border-gray-400 border-[#0E42D2] placeholder:text-gray-400"
                      />
                      {errorsLogin.matKhau && (
                        <p className="text-red-500">
                          {errorsLogin.matKhau.message}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-blue-500 text-sm mb-4">
                      <a href="/change-password" className="underline">
                        Quên mật khẩu?
                      </a>
                    </div>
                    <Button
                      onClick={handleSubmitLogin(onSubmitLogin)}
                      className="w-full bg-[#062D76] text-white"
                    >
                      <LogIn className="mr-2 w-4 h-4" /> Đăng nhập
                    </Button>
                  </div>
                  <div className="mt-4">
                    <GoogleLoginButton />
                    <FacebookLoginButton className="mt-2 w-full" />
                  </div>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="signup">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenND" className="text-[#086280]">
                        Tên người dùng
                      </Label>
                      <Input
                        id="tenND"
                        type="text"
                        {...registerSignUp("tenND")}
                        placeholder="Nhập tên người dùng"
                        className="col-span-3 dark:border-gray-400 border-[#0E42D2] placeholder:text-gray-400"
                      />
                      {errorsSignUp.tenND && (
                        <p className="text-red-500">
                          {errorsSignUp.tenND.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="identifier" className="text-[#086280]">
                        Email hoặc Số điện thoại
                      </Label>
                      <Input
                        id="identifier"
                        type="text"
                        {...registerSignUp("identifier")}
                        placeholder="Nhập email hoặc số điện thoại"
                        className="col-span-3 dark:border-gray-400 border-[#0E42D2] placeholder:text-gray-400"
                      />
                      {errorsSignUp.identifier && (
                        <p className="text-red-500">
                          {errorsSignUp.identifier.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matKhau" className="text-[#086280]">
                        Mật khẩu
                      </Label>
                      <Input
                        id="matKhau"
                        type="password"
                        {...registerSignUp("matKhau")}
                        placeholder="Nhập mật khẩu"
                        className="col-span-3 dark:border-gray-400 border-[#0E42D2] placeholder:text-gray-400"
                      />
                      {errorsSignUp.matKhau && (
                        <p className="text-red-500">
                          {errorsSignUp.matKhau.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ngaySinh">Ngày sinh</Label>
                      <Input
                        id="ngaySinh"
                        type="date"
                        {...registerSignUp("ngaySinh")}
                        className="col-span-3 dark:border-gray-400 border-[#0E42D2]"
                      />
                      {errorsSignUp.ngaySinh && (
                        <p className="text-red-500">
                          {errorsSignUp.ngaySinh.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#086280]">Giới tính</Label>
                      <Controller
                        name="gioiTinh"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Nam" id="male" />
                              <Label htmlFor="male">Nam</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Nu" id="female" />
                              <Label htmlFor="female">Nữ</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Khac" id="other" />
                              <Label htmlFor="other">Khác</Label>
                            </div>
                          </RadioGroup>
                        )}
                      />
                      {errorsSignUp.gioiTinh && (
                        <p className="text-red-500">
                          {errorsSignUp.gioiTinh.message}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleSubmitSignUp(onSubmitRegister)}
                      className="w-full bg-[#062D76] text-white"
                    >
                      Đăng ký
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              // OTP Verification Form
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center text-[#062D76]">
                  Xác thực Email
                </h3>
                <p className="text-center text-gray-600">
                  Vui lòng nhập mã OTP được gửi đến {otpEmail}
                </p>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[#086280]">
                    Mã OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    {...registerOTP("otp")}
                    placeholder="Nhập mã OTP 6 chữ số"
                    className="col-span-3 dark:border-gray-400 border-[#0E42D2] placeholder:text-gray-400"
                  />
                  {errorsOTP.otp && <p className="text-red-500">{errorsOTP.otp.message}</p>}
                </div>
                <Button
                  onClick={handleSubmitOTP(onSubmitOTP)}
                  className="w-full mt-4 bg-[#062D76] text-white"
                >
                  Xác nhận OTP
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => setShowOTP(false)}
                >
                  Quay lại
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;