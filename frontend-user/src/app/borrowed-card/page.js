// "use client";
// import React, { useState, useEffect } from "react";
// import LeftSideBar from "../components/LeftSideBar";
// import ChatBotButton from "../components/ChatBoxButton";
// import { useRouter } from "next/navigation";
// import { TbListDetails } from "react-icons/tb";
// import { LuTimerOff, LuBookCheck } from "react-icons/lu";
// import { FiLoader } from "react-icons/fi";
// import { Button } from "@/components/ui/button";
// import axios from "axios";

// const page = () => {
//   const [allBorrowCards, setAllBorrowCards] = useState([]);

//   const [selectedButton, setSelectedButton] = useState("Đã yêu cầu");

//   useEffect(() => {
//     const fetchBorrowCards = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("persist:root")); // lấy thông tin người dùng từ localStorage
        
//         const response = await axios.post(
//           `http://localhost:8080/api/borrow-cards/user/${user.id}` // lấy thông tin phiếu mượn của người dùng
//         );
//         setAllBorrowCards(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error("Lỗi khi fetch phiếu mượn:", error);
//       }
//     };

//     fetchBorrowCards();
//   }, []);

//   const filteredCards = allBorrowCards.filter((card) => {
//     if (selectedButton === "Đã yêu cầu")
//       return card.status === "Đã yêu cầu";
//     if (selectedButton === "Đang mượn") return card.status === "Đang mượn";
//     if (selectedButton === "Hết hạn") return card.status === "Hết hạn";
//     return false;
//   });

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("vi-VN"); // Kết quả: 22/04/2025
//   };

//   const handleButtonClick = (buttonType) => {
//     setSelectedButton(buttonType);
//   };

//   const route = useRouter();
//   const handleDetails = (id) => {
//     route.push(`/borrowed-card/${id}`);
//   };

//   return (
//     <main className="flex flex-col min-h-screen text-foreground w-full">
//       <div className="pt-16 flex">
//         <LeftSideBar />
//         <section className="self-stretch pr-[1.25rem] md:pl-60 ml-[1.25rem] my-auto w-full max-md:max-w-full mt-2 mb-2">
//           <div className="mx-auto">
//             <header className="flex justify-between gap-8 max-lg:gap-3 max-sm:flex-col bg-white p-3 rounded-xl">
//               {/* Current Borrowings Status */}
//               <Button
//                 className={`flex flex-1 gap-2 justify-center items-center text-[1.125rem] max-md:text-[1rem] rounded-md py-5 max-md:py-2 cursor-pointer ${
//                   selectedButton === "Đã yêu cầu"
//                     ? "bg-[#062D76] text-white hover:bg-[#062D76] hover:text-white"
//                     : "bg-gray-300 text-[#131313] hover:bg-[#062D76] hover:text-white"
//                 }`}
//                 onClick={() => handleButtonClick("Đã yêu cầu")}
//               >
//                 <FiLoader
//                   style={{
//                     width: "1.25rem",
//                     height: "1.25rem",
//                   }}
//                   className="size-6"
//                 />
//                 Đã yêu cầu
//               </Button>

//               <Button
//                 className={`flex flex-1 gap-2 justify-center items-center text-[1.125rem] max-md:text-[1rem] font-medium rounded-md py-5 max-md:py-2 cursor-pointer ${
//                   selectedButton === "Đang mượn"
//                     ? "bg-[#062D76] text-white hover:bg-[#062D76] hover:text-white"
//                     : "bg-gray-300 text-[#131313] hover:bg-[#062D76] hover:text-white"
//                 }`}
//                 onClick={() => handleButtonClick("Đang mượn")}
//               >
//                 <LuBookCheck
//                   style={{
//                     width: "1.25rem",
//                     height: "1.25rem",
//                   }}
//                   className="size-6"
//                 />
//                 Đang mượn
//               </Button>

//               {/* Returned Status */}
//               <Button
//                 className={`flex flex-1 gap-3 justify-center items-center text-[1.125rem] max-md:text-[1rem] font-medium rounded-md py-5 max-md:py-2 cursor-pointer ${
//                   selectedButton === "Hết hạn"
//                     ? "bg-[#062D76] text-white hover:bg-[#062D76] hover:text-white"
//                     : "bg-gray-300 text-[#131313] hover:bg-[#062D76] hover:text-white"
//                 }`}
//                 onClick={() => handleButtonClick("Hết hạn")}
//               >
//                 <LuTimerOff
//                   style={{
//                     width: "1.25rem",
//                     height: "1.25rem",
//                   }}
//                   className="size-6"
//                 />
//                 Hết hạn
//               </Button>
//             </header>

//             {/* Search Section */}
//             {/* <div className="flex flex-wrap gap-3 items-center px-3 py-2.5 mt-3 w-full text-[1.125rem] leading-none text-[#062D76] bg-white backdrop-blur-[100px] min-h-[50px] rounded-[100px] max-md:max-w-full">
//               <img
//                 src="https://cdn.builder.io/api/v1/image/assets/TEMP/669888cc237b300e928dbfd847b76e4236ef4b5a?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816"
//                 alt="Search icon"
//                 className="object-contain shrink-0 self-stretch my-auto aspect-square w-[30px] cursor-pointer"
//               />
//               <input
//                 type="search"
//                 id="search-input"
//                 placeholder="Tìm kiếm"
//                 className="flex-1 md:text-[1.125rem] bg-transparent border-none outline-none placeholder-[#062D76] text-[#062D76] focus:ring-2 focus:ring-red-dark focus:ring-opacity-50"
//               />
//             </div> */}

//             {/* Borrowing Cards Section */}
//             <section className="gap-y-2.5 mt-5">
//               {filteredCards.map((borrowing) => (
//                 <article
//                   key={borrowing.id}
//                   className="p-4 bg-white rounded-xl shadow-sm mb-2"
//                 >
//                   <div className="flex justify-between items-center max-md:flex-col max-md:gap-5 max-md:items-start">
//                     <div className="flex flex-col gap-2">
//                       <h3 className="text-[1rem] font-semibold text-[#131313]/50">
//                         ID:{" "}
//                         <span className="text-[#131313] font-medium">
//                           {borrowing.id}
//                         </span>
//                       </h3>
//                       <p className="text-[1rem] font-semibold text-[#131313]/50">
//                         User ID:{" "}
//                         <span className="text-[#131313] font-medium ">
//                           {borrowing.userId}
//                         </span>
//                       </p>
//                       <p className="text-[1rem] font-semibold text-[#131313]/50">
//                         Ngày mượn:{" "}
//                         <span className="text-[#131313] font-medium ">
//                           {formatDate(borrowing.borrowDate)}
//                         </span>
//                       </p>
//                       <p className="text-[1rem] font-semibold text-[#131313]/50">
//                         {selectedButton === "Đang mượn" && (
//                           <>
//                             Ngày trả dự kiến:{" "}
//                             <span className="text-[#131313] font-medium">
//                               {formatDate(borrowing.dueDate)}
//                             </span>
//                           </>
//                         )}

//                         {selectedButton === "Hết hạn" && (
//                           <>
//                             Ngày trả:{" "}
//                             <span className="text-[#131313] font-medium">
//                               {formatDate(borrowing.dueDate)}
//                             </span>
//                           </>
//                         )}

//                         {selectedButton === "Đã yêu cầu" && (
//                           <>
//                             Hạn lấy sách:{" "}
//                             <span className="text-[#131313] font-medium">
//                               {formatDate(borrowing.getBookDate)}
//                             </span>
//                           </>
//                         )}
//                       </p>
//                     </div>
//                     <Button
//                       className="flex gap-2 justify-center items-center px-3 py-1 text-[1rem] font-normal self-center bg-[#062D76] text-white hover:bg-[#E6EAF1] hover:text-[#062D76] rounded-3xl cursor-pointer"
//                       aria-label={`View details for borrowing ${borrowing.id}`}
//                       onClick={() => {
//                         handleDetails(borrowing.id);
//                       }}
//                     >
//                       <TbListDetails
//                         style={{
//                           width: "1.5rem",
//                           height: "1.5rem",
//                           strokeWidth: "1px",
//                         }}
//                         className="size-6"
//                       />
//                       Xem chi tiết
//                     </Button>
//                   </div>
//                 </article>
//               ))}
//             </section>
//           </div>
//         </section>
//         <ChatBotButton />
//       </div>
//     </main>
//   );
// };

// export default page;