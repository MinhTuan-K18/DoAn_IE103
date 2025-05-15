// "use client";
// import React, { useEffect, useState } from "react";
// import LeftSideBar from "@/app/components/LeftSideBar";
// import ChatBotButton from "../../components/ChatBoxButton";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { ThreeDot } from "react-loading-indicators";

// const BookCard = ({
//   imageSrc,
//   title,
//   category,
//   author,
//   publisher,
//   borrowCount,
// }) => {
//   return (
//     <article className="flex grow shrink gap-3 min-w-60 cursor-pointer bg-white rounded-xl shadow-[0px_2px_2px_rgba(0,0,0,0.25)] p-5">
//       <img
//         src={imageSrc}
//         alt={title}
//         className="object-cover shrink rounded-sm aspect-[0.67] w-[100px]"
//       />
//       <div className="flex flex-col flex-1 shrink self-end basis-0">
//         <h3 className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-[1.125rem] font-medium text-black basis-0">
//           {title}
//         </h3>
//         <p className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-base text-black basis-0">
//           Tác giả: {author}
//         </p>
//         <p className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-base text-black basis-0">
//           Thể loại: {category}
//         </p>
//         <p className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-base text-black basis-0">
//           NXB: {publisher}
//         </p>
//         <p className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-base text-black basis-0">
//           Lượt mượn: {borrowCount}
//         </p>
//       </div>
//     </article>
//   );
// };

// const BorrowingInfo = ({ info }) => {
//   return (
//     <section className=" flex flex-col p-5 bg-white rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:px-5 max-md:max-w-full">
//       <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
//         {/* Cột 1 */}

//         <div className="flex flex-col gap-5 items-start text-[1.125rem] font-medium text-black">
//           <p className="text-[1rem] font-semibold text-[#131313]/50">
//             ID Phiếu:{" "}
//             <span className="text-[#131313] font-medium ">
//               {info.id}
//             </span>
//           </p>
//           <p className="text-[1rem] font-semibold text-[#131313]/50">
//             Ngày mượn:{" "}
//             <span className="text-[#131313] font-medium ">
//               {new Date(info.borrowDate).toLocaleDateString("vi-VN")}
//             </span>
//           </p>
//           {info.dueDate ? (
//             <p className="text-[1rem] font-semibold text-[#131313]/50">
//               Ngày trả sách:{" "}
//               <span className="text-[#131313] font-medium ">
//                 {new Date(info.dueDate).toLocaleDateString("vi-VN")}
//               </span>
//             </p>
//           ) : (
//             <p className="text-[1rem] font-semibold text-[#131313]/50">
//               Hạn lấy sách:{" "}
//               <span className="text-[#131313] font-medium ">
//                 {new Date(info.getBookDate).toLocaleDateString("vi-VN")}
//               </span>
//             </p>
//           )}
//         </div>

//         {/* Cột 2 */}
//         <div className="flex flex-col gap-5 items-start text-[1.125rem] font-medium text-black">
//           <p className="text-[1rem] font-semibold text-[#131313]/50">
//             ID Người Dùng:{" "}
//             <span className="text-[#131313] font-medium ">{info.userId}</span>
//           </p>
//           <p className="text-[1rem] font-semibold text-[#131313]/50">
//             Tên Người Dùng:{" "}
//             <span className="text-[#131313] font-medium ">{info.userName}</span>
//           </p>
//           <p className="text-[1rem] font-semibold text-[#131313]/50">
//             Số lượng mượn:{" "}
//             <span className="text-[#131313] font-medium ">
//               {info.totalBooks}
//             </span>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// const ChiTietPhieuMuon = () => {
//   const { id } = useParams();
//   const [borrowDetail, setBorrowDetail] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [popUpOpen, setPopUpOpen] = useState(false);
//   const [deleteOne, setDeleteOne] = useState(null);
//   const router = useRouter();
//   useEffect(() => {
//     const fetchBorrowCardDetail = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/borrow-cards/${id}`
//         );
//         setBorrowDetail(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error("Lỗi khi fetch chi tiết phiếu mượn:", error);
//         toast.error("Không thể tải dữ liệu phiếu mượn");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBorrowCardDetail();
//   }, [id]);

//   const handleDelete = async (info) => {
//     try {
//       await axios.delete(`http://localhost:8081/borrow-card/${info.borrowCardId}`);
//       toast.success("Xóa phiếu thành công");
//       setPopUpOpen(false);

//       router.push("/borrowed-card");
//     } catch (err) {
//       toast.error("Xóa phiếu thất bại");
//     }
//   };

//   if (loading) {
//     return (
//       <main className="flex flex-col min-h-screen text-foreground">
//         <div className="pt-16 flex">
//           <LeftSideBar />
//           <section className="flex justify-center items-center self-center pr-[1.25rem] md:pl-60 ml-[1.25rem] w-full h-screen">
//             <ThreeDot
//               color="#062D76"
//               size="large"
//               text="Vui lòng chờ"
//               variant="bounce"
//               textColor="#062D76"
//               className="self-center flex justify-center items-center"
//             />
//           </section>
//         </div>
//       </main>
//     );
//   }

//   if (!borrowDetail) {
//     return (
//       <div className="md:ml-60 top-16 justify-center items-center">
//         Không tìm thấy phiếu mượn!
//       </div>
//     );
//   }

//   return (
//     <main className="flex flex-col min-h-screen text-foreground">
//       <div className="pt-16 flex">
//         <LeftSideBar />
//         <section className="self-stretch pr-[1.25rem] md:pl-60 ml-[1.25rem] my-auto w-full max-md:max-w-full mt-2 mb-2">
//           <div className="flex flex-col w-full max-md:max-w-full">
//             <Button
//               className="flex self-end text-[1rem] cursor-pointer bg-red-500 hover:bg-red-700 text-white w-fit mb-2"
//               onClick={() => setPopUpOpen(true)}
//             >
//               <img src="/icon/trash.svg" alt="Delete" className="mr-2" />
//               Xóa
//             </Button>
//             <BorrowingInfo info={borrowDetail} />

//             <h2 className="text-lg font-medium text-[#062D76] text-center mt-5 ">
//               Danh sách sách mượn
//             </h2>
//             <section className="grid grid-cols-1 max-sm:grid-cols-1 gap-5 items-start mt-2 w-full max-md:max-w-full">
//               {borrowDetail?.bookIds?.map((book, index) => (
//                 <BookCard
//                   key={index}
//                   imageSrc={book.image}
//                   title={book.name}
//                   author={book.author}
//                   category={book.category}
//                   publisher={book.publisher}
//                   borrowCount={book.borrowCount}
//                 />
//               ))}
//             </section>
//           </div>
//         </section>
//         <ChatBotButton />
//         {popUpOpen && (
//           <div className="fixed inset-0 items-center justify-center z-100 flex">
//             <div className="w-full h-full bg-black opacity-[80%] absolute top-0 left-0"></div>
//             <div className="flex flex-col justify-center self-center bg-white p-6 rounded-lg shadow-lg w-auto fixed">
//               <img
//                 src="/icon/canh_bao.svg"
//                 alt="Delete"
//                 className="mb-2 w-8 h-8 self-center"
//               />
//               <p className="flex justify-center">
//                 Bạn có chắc chắn muốn xóa phiếu này không?
//               </p>

//               <div className="flex justify-center mt-4 gap-4">
//                 <Button
//                   className="bg-gray-500 hover:bg-gray-700  text-white cursor-pointer"
//                   onClick={() => setPopUpOpen(false)}
//                 >
//                   Hủy
//                 </Button>
//                 <Button
//                   className="bg-red-500 hover:bg-red-700 justify-center text-white cursor-pointer"
//                   onClick={() => handleDelete(borrowDetail)}
//                 >
//                   Xóa
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// export default ChiTietPhieuMuon;