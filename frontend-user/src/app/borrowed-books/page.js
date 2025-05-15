// "use client";

// import React, { useState, useEffect } from "react";
// import LeftSideBar from "../components/LeftSideBar";
// import ChatBox from "../components/ChatBoxButton";
// import Image from "next/image";

// import useSidebarStore from "@/store/sidebarStore";
// import axios from "axios";

// const BookStatus = ({ status }) => (
//   <div
//     className={`px-2 py-1 text-white w-fit text-sm font-medium rounded-lg flex items-center gap-1 ${
//       status === "Còn sẵn" ? "bg-green-500" : "bg-red-500"
//     }`}
//   >
//     <span>{status}</span>
//     <span
//       className={`w-2 h-2 rounded-full ${
//         status === "Còn sẵn" ? "bg-green-300" : "bg-red-300"
//       }`}
//     />
//   </div>
// );

// const BorrowedPage = () => {
//   const [borrowedList, setBorrowedList] = useState([]);
//   const isSidebarOpen = useSidebarStore();

//   useEffect(() => {
//     const fetchBorrowed = async () => {
//       try {
//         // Gọi endpoint trả về BookChild có status BORROWED
//         const { data: children } = await axios.get(
//           "http://localhost:8080/api/bookchild/borrowed"
//         );
//         // Map ra thông tin cần hiển thị
//         const list = children.map((c) => {
//           const b = c.book; // object Book parent
//           // Tính trạng thái parent (còn sách hay hết) nếu cần
//           const available =
//             b.tongSoLuong - b.soLuongMuon - (b.soLuongXoa || 0) > 0;
//           return {
//             copyId: c.id,
//             title: b.tenSach,
//             author: b.tenTacGia,
//             publisher: b.nxb,
//             image: Array.isArray(b.hinhAnh) && b.hinhAnh.length
//               ? b.hinhAnh[0]
//               : "/images/test.webp",
//             status: "Đã mượn",
//             available,
//           };
//         });
//         setBorrowedList(list);
//       } catch (err) {
//         console.error("Lỗi khi fetch BookChild:", err);
//       }
//     };

//     fetchBorrowed();
//   }, []);

//   return (
//     <div className="min-h-screen pt-16 flex w-full text-foreground bg-[#E6EAF1] relative">
//       <LeftSideBar />

//       <div
//         className={`flex-1 py-4 px-0 transition-all duration-300 ${
//           isSidebarOpen ? "md:ml-64" : "md:ml-0"
//         }`}
//       >
//         <div className="flex flex-col p-6 bg-white rounded-2xl">
//           <p className="px-6 py-3 w-fit bg-blue-400 rounded-2xl flex items-center gap-3 text-white text-lg font-normal">
//             Sách đang mượn
//           </p>
//           <div className="grid grid-cols-2 gap-4 p-3">
//             {borrowedList.length > 0 ? (
//               borrowedList.map((item) => (
//                 <div
//                   key={item.copyId}
//                   className="flex w-[450px] gap-6 bg-white p-4 rounded-lg shadow-md"
//                 >
//                   <Image
//                     src={item.image}
//                     width={100}
//                     height={150}
//                     alt={item.title}
//                     className="object-cover rounded"
//                   />
//                   <div className="flex flex-col gap-3">
//                     <BookStatus status={item.status} />
//                     <h3 className="font-semibold">{item.title}</h3>
//                     <p className="text-sm text-gray-600">
//                       Tác giả: {item.author}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       NXB: {item.publisher}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Mã bản sao: {item.copyId}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="col-span-2 text-center text-gray-500">
//                 Hiện không có bản sao nào đang mượn.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="fixed flex items-center right-4 bottom-4 z-50">
//         <ChatBox />
//       </div>
//     </div>
//   );
// };

// export default BorrowedPage;
