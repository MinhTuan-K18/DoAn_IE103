"use client";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

// Validation schema for login
const loginSchema = yup.object().shape({
    loginInput: yup
        .string()
        .required("Vui lòng nhập số điện thoại hoặc email")
        .test("is-email-or-phone", "Vui lòng nhập email hợp lệ hoặc số điện thoại", (value) => {
            if (!value) return false;
            // Check if input is email (contains @) or phone (digits only)
            const isEmail = value.includes("@");
            const isPhone = /^\d+$/.test(value);
            return isEmail || isPhone;
        }),
    password: yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu không được để trống"),
});

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Determine if input is email or phone
            const isEmail = data.loginInput.includes("@");
            const payload = {
                [isEmail ? "email" : "phone"]: data.loginInput,
                password: data.password,
            };

            // Make backend call
            const response = await fetch("http://localhost:8080/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Đăng nhập thất bại");
            }

            toast.success("Đăng nhập thành công");
            router.push("/dashboard");
        } catch (error) {
            toast.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FDFF] p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <Card className="w-[400px] max-w-lg border border-blue-500 shadow-lg p-6">
                    <CardHeader className="text-center">
                        <CardTitle>
                            <img src="/images/logo.jpg" alt="Admin Panel" className="w-24 mx-auto" />
                        </CardTitle>
                        <CardDescription className="text-center text-[#1CA2C1] text-[16px]">
                            Đăng nhập vào tài khoản quản trị
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="loginInput" className="text-[#086280]">Số điện thoại hoặc Email</Label>
                                    <Input
                                        id="loginInput"
                                        name="loginInput"
                                        type="text"
                                        {...register("loginInput")}
                                        placeholder="Nhập số điện thoại hoặc email"
                                        className="col-span-3 dark:border-gray-400 border-[#0E42D2] placeholder:text-gray-400"
                                    />
                                    {errors.loginInput && (
                                        <p className="text-red-500">{errors.loginInput.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="loginPassword" className="text-[#086280]">Mật khẩu</Label>
                                    <Input
                                        id="loginPassword"
                                        name="password"
                                        type="password"
                                        {...register("password")}
                                        placeholder="Nhập mật khẩu của bạn"
                                        className="col-span-3 dark:border-gray-400 border-[#0E42D2] placeholder:text-gray-400"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500">{errors.password.message}</p>
                                    )}
                                </div>
                                <Button className="w-full bg-[#23CAF1] text-white mt-5" type="submit" disabled={loading}>
                                    <LogIn className="mr-2 w-4 h-4" /> {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Page;