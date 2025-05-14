"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Users,
  BarChart2,
  Mail,
  Github,
  CheckCircle,
  shell,
  database,
  BracesIcon,
  ShellIcon,
  Database,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: <Search className="w-6 h-6 text-blue-600" />,
    title: "Tra cứu sách",
    description:
      "Tìm kiếm sách theo tên, tác giả, thể loại một cách nhanh chóng.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-green-600" />,
    title: "Quản lý mượn/trả",
    description: "Giao diện dễ dùng để mượn, trả và gia hạn sách.",
  },
  {
    icon: <Users className="w-6 h-6 text-purple-600" />,
    title: "Tài khoản người dùng",
    description: "Quản lý sinh viên, giảng viên và thủ thư trong hệ thống.",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-orange-600" />,
    title: "Thống kê",
    description: "Tự động thống kê số lượng sách, lượt mượn theo thời gian.",
  },
];

const teamMembers = [
  {
    avt: "/images/Huyen1.jpg",
    name: "Nguyễn Lê Thanh Huyền",
    mssv: "22520590",
    role: "Leader",
    nghanh: "Công nghệ thông tin",
  },
  {
    avt: "/images/Tri.jpg",
    name: "Nguyễn Thanh Trí",
    mssv: "23521645",
    role: "Member",
    nghanh: "Công nghệ Nhật Bản",
  },
  {
    avt: "/images/Thao1.jpg",
    name: "Lê Thị Phương Thảo",
    mssv: "23521468",
    role: "Member",
    nghanh: "Hệ thống thông tin",
  },
  {
    avt: "/images/Trang.jpg",
    name: "Lê Thị Thùy Trang",
    mssv: "23521627",
    role: "Member",
    nghanh: "Công nghệ Nhật Bản",
  },
];

const genres = [
  "Khoa học – Công nghệ",
  "Kinh tế – Quản trị",
  "Văn học – Nghệ thuật",
  "Ngoại ngữ",
  "Tâm lý – Giáo dục",
  "Lịch sử – Địa lý",
  "Truyện – Tiểu thuyết",
  "Tài liệu học tập",
  "Sách tham khảo",
  "Sách thiếu nhi",
  "... và nhiều thể loại khác",
];

const benefits = [
  "Tiết kiệm thời gian tra cứu và mượn/trả sách",
  "Tránh thất lạc dữ liệu, lưu trữ tập trung",
  "Thống kê tự động và chính xác",
  "Trải nghiệm người dùng hiện đại, dễ sử dụng",
  "Hỗ trợ nhiều vai trò: sinh viên, thủ thư, quản trị viên",
  "Đăng nhập nhanh bằng tài khoản Google/Facebook",
];

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-pink-100 flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800"></h1>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10 text-center max-w-7xl">
        <h2 className="text-4xl font-bold mb-6 text-blue-800">
          Giới thiệu Hệ thống Quản lý Thư viện
        </h2>
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Image on the left */}
            <div className="flex-shrink-0 h-[400px] place-items-start">
              <Image
                src="/images/thuvien.jpg"
                alt="Library Management System"
                width={250}
                height={350}
                className="object-cover rounded-lg shadow-md"
              />
            </div>
            {/* Text on the right */}
            <div className="flex-1">
              <p className="text-gray-600 text-lg mb-4">
                Trong thời đại chuyển đổi số mạnh mẽ như hiện nay, việc ứng dụng
                công nghệ vào công tác quản lý là xu hướng tất yếu trong nhiều
                lĩnh vực, đặc biệt là trong giáo dục. Tại các trường học, công
                tác quản lý thư viện vẫn còn tồn tại nhiều hạn chế như sử dụng
                phương pháp ghi chép thủ công, mất nhiều thời gian trong việc
                tìm kiếm sách, quản lý mượn/trả, và thống kê số liệu. Những khó
                khăn này không chỉ ảnh hưởng đến hiệu quả làm việc của thủ thư
                mà còn gây bất tiện cho người dùng cuối là sinh viên và giảng
                viên. Nhận thấy vấn đề trên, nhóm chúng tôi đã quyết định thực
                hiện đồ án <strong>Hệ thống Quản lý Thư viện</strong> với mong
                muốn xây dựng một nền tảng trực tuyến hỗ trợ việc tra cứu, mượn,
                trả và quản lý sách một cách thuận tiện, chính xác và hiện đại.
                Hệ thống không chỉ giúp tiết kiệm thời gian và công sức cho cả
                người dùng và quản trị viên, mà còn tạo điều kiện cho việc mở
                rộng và tích hợp các tính năng nâng cao trong tương lai như:
                đăng nhập mạng xã hội, quản lý sách điện tử, gửi thông báo tự
                động,... Bên cạnh đó, đây cũng là cơ hội để nhóm áp dụng các
                kiến thức đã học và thực hiện đồ án môn IS216-Lập trình Java như
                phát triển frontend bằng <strong>Next.js</strong>, xây dựng
                backend với <strong>Spring Boot</strong>, sử dụng cơ sở dữ liệu{" "}
                <strong>Supabase</strong> và tích hợp xác thực người dùng qua{" "}
                <strong>Supabase OAuth</strong>. Qua dự án này, nhóm không chỉ
                rèn luyện kỹ năng lập trình và làm việc nhóm mà còn góp phần
                mang đến một giải pháp thực tiễn cho nhu cầu quản lý thư viện
                hiện nay.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700 text-sm mt-2">
                <div className="bg-white p-4 rounded-xl shadow text-sm font-medium text-gray-700 flex items-center gap-2 hover:shadow-md transition">
                  <BracesIcon className="text-gray-500 w-5 h-5" /> Next.js
                </div>
                <div className="bg-white p-4 rounded-xl shadow text-sm font-medium text-gray-700 flex items-center gap-2 hover:shadow-md transition">
                  <ShellIcon className="text-pink-500 w-5 h-5" /> Spring Boot
                </div>
                <div className="bg-white p-4 rounded-xl shadow text-sm font-medium text-gray-700 flex items-center gap-2 hover:shadow-md transition">
                  <Database className="w-5 h-5" /> Supabase
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 bg-pink-200 rounded-lg shadow-md justify-items-center">
        <h2 className="text-4xl font-bold mb-6 text-blue-800 text-center">
          Các tính năng nổi bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-8 max-w-7xl">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        {/*<p className="text-center text-gray-600 mb-6">
          Discover Your Heart Friend: Discover Our Chatters To Choose Who Makes
          Of Sense Of Place, Walking Or Cuddling. Or Loving Family, By Adopting
          You’re Not Only Changing One-Life-You’re Making A Difference For
          Countless Others, Visit Us Today And Find A Friend Who’ll Bring Joy
          And Unconditional Love Into Your Life!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img
              src="/ninja-warrior.jpg"
              alt="Ninja Warrior"
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="font-semibold">Ninja Warrior</h3>
            <p className="text-gray-600">
              Tender nature, loves to roam and sniffing new friends. Perfect
              match for you all! 3 years old.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img
              src="/cat-sophie.jpg"
              alt="Sophie"
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="cat-sophie">Sophie</h3>
            <p className="text-gray-600">
              A medium mini with enormous heart, loves curious explorer with
              kids. 1-2 years old.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img
              src="/cat-winky.jpg"
              alt="Winky"
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="font-semibold">Winky</h3>
            <p className="text-gray-600">
              Fun and energetic cat from chasing feather toys to darting around
              house with love. 2 years old.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img
              src="/t-rex.jpg"
              alt="T-Rex"
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="font-semibold">T-Rex</h3>
            <p className="text-gray-600">
              T-Rex is a happy pup with an overly complex love of fetch and
              snuggle. 2 years old.
            </p>
          </div>
        </div>*/}
      </section>

      {/* Đa dạng thể loại sách */}
      <section className="container mx-auto px-4 py-10 text-center justify-items-center max-w-9xl">
        <h2 className="text-4xl font-bold mb-6 text-blue-800">
          Đa dạng thể loại sách
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4 ">
          {genres.map((genre, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow text-sm font-medium text-gray-700 flex items-center gap-2 hover:shadow-md transition"
            >
              <BookOpen className="w-5 h-5 text-blue-600" />
              {genre}
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 bg-pink-200 rounded-lg shadow-md justify-items-center">
        <h2 className="text-4xl font-bold mb-6 text-blue-800 text-center">
          Lợi ích khi sử dụng
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700 text-sm mt-6">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white shadow p-3 rounded-xl"
            >
              <CheckCircle className="text-green-500 w-5 h-5" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Meet our team */}
      <section className="container mx-auto px-4 py-10 text-center justify-items-center max-w-9xl">
        <h2 className="text-4xl font-bold mb-6 text-blue-800">
          Nhóm phát triển
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-14 mb-0">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white  rounded-xl shadow-md h-[440px] w-full sm:w-60"
            >
              <Image
                src={member.avt}
                alt={member.name}
                width={150}
                height={200}
                className="rounded-t-xl mx-auto mb-0 w-full"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.mssv}</p>
                <p className="text-gray-600">{member.role}</p>
                <p className="text-gray-600">{member.nganh}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <footer className="bg-blue-300 text-white py-4 text-center">
        <h3 className="text-2xl font-semibold text-white mb-2">Liên hệ</h3>
        <div className="flex flex-col sm:flex-row justify-center gap-4 text-white">
          <a
            href="mailto:8386@gmail.com"
            className="flex items-center gap-2 hover:text-black"
          >
            <Mail className="w-5 h-5" />
            8386@gmail.com
          </a>
          <a
            href="https://github.com/yurri2506"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-black"
          >
            <Github className="w-5 h-5" />
            github.com/yurri2506
          </a>
        </div>
      </footer>
    </div>
  );
};

export default page;
