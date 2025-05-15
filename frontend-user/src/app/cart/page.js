// "use client";
// import React, { useState, useEffect } from "react";
// import LeftSideBar from "../components/LeftSideBar";
// import BookCard from "./book";
// import axios from "axios";
// const books = [
//   {
//     id: "DRPN001",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/9b777cb3ef9abb920d086e97e27ac4f6f3559695",
//     available: true,
//     title: "Nam cao",
//     author: "Văn học",
//     publisher: "Văn học Việt Nam (2019)",
//     borrowCount: 120,
//   },
//   {
//     id: "DRPN002",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/fc01b7cf44e0ca2f23258dcc0ad69329b2612af0?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
//     available: false,
//     title: "Nam cao",
//     author: "Văn học",
//     publisher: "Văn học Việt Nam (2019)",
//     borrowCount: 120,
//   },
//   {
//     id: "DRPN003",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/5e8a0f3fd4681a9512313c2c1c6dae1285bcf0a6?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
//     available: true,
//     title: "Nam cao",
//     author: "Văn học",
//     publisher: "Văn học Việt Nam (2019)",
//     borrowCount: 120,
//   },
//   {
//     id: "DRPN004",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/d854294877ea4263cf3494a98eecfd64cd148327?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
//     available: false,
//     title: "Nam cao",
//     author: "Văn học",
//     publisher: "Văn học Việt Nam (2019)",
//     borrowCount: 120,
//   },
//   {
//     id: "DRPN005",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/acf848c9260bfc86d1f9094e17e14ec25f3ec193?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
//     available: true,
//     title: "Nam cao",
//     author: "Văn học",
//     publisher: "Văn học Việt Nam (2019)",
//     borrowCount: 120,
//   },
//   {
//     id: "DRPN006",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/d854294877ea4263cf3494a98eecfd64cd148327?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
//     available: false,
//     title: "Nam cao",
//     author: "Văn học",
//     publisher: "Văn học Việt Nam (2019)",
//     borrowCount: 120,
//   },
// ];

// const page = () => {
//   const [selected, setSelected] = useState([]);
//   const [books, setBooks] = useState(""); // Giỏ hàng
//   const [loading, setLoading] = useState(true); // Trạng thái loading
//   const user = JSON.parse(localStorage.getItem("persist:root")); // lấy thông tin người dùng từ localStorage
//   let cartId = "";

//   // Lấy giỏ hàng từ API theo userId
//   const fetchCart = async () => {
//     try {
//       setLoading(true); // Bắt đầu tải dữ liệu
//       const response = await fetch(
//         `http://localhost:8080/api/cart/${user.id}` // Endpoint API lấy giỏ hàng theo userId
//       ); // Endpoint API lấy giỏ hàng theo userId

//       if (response.ok) {
//         const data = await response.json();
//         cartId = data.id;
//         setBooks(data.data); // Giả sử API trả về đối tượng có key 'books'
//       } else {
//         console.error("Lỗi khi lấy giỏ hàng");
//       }
//     } catch (error) {
//       console.error("Có lỗi xảy ra:", error);
//     } finally {
//       setLoading(false); // Hoàn tất việc gọi API
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [user.id]);

//   // tick / bỏ tick 1 cuốn
//   const toggleBook = (idx, checked) => {
//     setSelected((prev) =>
//       checked ? [...prev, idx] : prev.filter((i) => i !== idx)
//     );
//   };

//   // tick / bỏ tick tất cả
//   const allChecked = selected.length === books?.length;
//   const toggleAll = (checked) =>
//     setSelected(checked ? books.map((_, i) => i) : []);

//   // Xóa sách trong giỏ hàng
//   const handleDeleteBooks = async () => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:8080/api/cart/${cartId}`, // Endpoint API xóa sách trong giỏ hàng
//         {
//           data: selected,
//         }
//       );

//       setBooks(response.data.data); // Cập nhật lại giỏ hàng sau khi xóa
//       console.log("Xóa sách thành công:", response.data);
//       alert("Xóa sách thành công!");
//       setSelected([]); // Reset lại danh sách đã chọn
//     } catch (error) {
//       console.error("Lỗi khi xóa sách:", error);
//       alert("Đã có lỗi khi xóa sách!");
//     }
//   };

//   // Đăng ký mượn sách
//   const handleBorrowBooks = async () => {
//     try {
//       const booksInCart = selected; // Các sách đã chọn trong giỏ hàng
//       // console.log(booksInCart);
//       // Gửi yêu cầu đến backend để tạo phiếu mượn
//       const response = await axios.post(
//         "http://localhost:8080/api/borrow-cards",
//         {
//           userId: user.id,
//           borrowedBooks: booksInCart.map((bookId) => ({
//             bookId: bookId,
//             childBookId: null,
//           })),
//           borrowDate: new Date().toISOString(),
//           status: "REQUESTED",
//           dueDate: new Date(
//             new Date().setDate(new Date().getDate() + 14)
//           ).toISOString(), // Ngày trả sách là 14 ngày sau
//         }
//       );

//       if (response.status === 200) {
//         alert("Phiếu mượn đã được tạo!");
//         console.log(response.data); // Xem chi tiết phiếu mượn

//         const deleteResponse = await axios.delete(
//           `http://localhost:8080/api/cart/${user.id}/remove/books`,
//           {
//             data: booksInCart,
//           }
//         );

//         console.log(deleteResponse.data); // Xem sách đã xóa khỏi giỏ hàng
//         window.location.href = "/borrowed-card";
//       } else {
//         alert("Không thể tạo phiếu mượn");
//       }
//     } catch (error) {
//       console.error("Lỗi khi mượn sách:", error);
//       alert("Có lỗi xảy ra khi mượn sách.");
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen text-foreground">
//       <main className="pt-16 flex">
//         <LeftSideBar />
//         <section className="self-stretch pr-[1.25rem] md:pl-64 ml-[1.25rem] my-auto w-full max-md:max-w-full mt-2">
//           <div className="flex flex-col p-5 w-full bg-white rounded-xl max-md:max-w-full">
//             <div className="flex items-center justify-center gap-3">
//               <h2 className="gap-2.5 self-center px-[1.25rem] py-[0.625rem] text-[1.5rem] text-[#062D76] font-semibold rounded-lg">
//                 Giỏ sách
//               </h2>
//             </div>
//             <div className="grid grid-cols-1 max-sm:grid-cols-1 gap-5 items-start mt-5 w-full max-md:max-w-full">
//               {Array.isArray(books) &&
//                 books.map((book, index) => (
//                   <BookCard
//                     key={book.bookId}
//                     id={book.bookId}
//                     imageSrc={book.hinhAnh[0]}
//                     available={
//                       book.tongSoLuong - book.soLuongMuon - book.soLuongXoa > 0
//                         ? "Còn sẵn"
//                         : "Hết sách"
//                     }
//                     title={book.tenSach}
//                     author={book.tenTacGia}
//                     publisher={book.nxb}
//                     borrowCount={book.soLuongMuon}
//                     checked={selected.includes(book.bookId)}
//                     onCheck={(c) => toggleBook(book.bookId, c)}
//                   />
//                 ))}
//             </div>
//           </div>
//           {selected.length > 0 && (
//             <footer className="fixed bottom-0 self-stretch mr-[1.25rem] md:left-64 ml-[1.25rem] right-0 bg-[#E6EAF1] shadow-lg p-4 flex justify-between">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   className="w-5 h-5 accent-[#F7302E] cursor-pointer"
//                   checked={allChecked}
//                   onChange={(e) => toggleAll(e.target.checked)}
//                 />
//                 <span className="text-sm font-medium text-[#062D76]">
//                   Chọn tất cả ({books.length})
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={handleDeleteBooks}
//                   className="px-4 py-2 bg-[#F44336] hover:bg-[#FFA9A2] text-white rounded cursor-pointer"
//                 >
//                   Xóa sách ({selected.length})
//                 </button>

//                 <button
//                   onClick={handleBorrowBooks}
//                   className="px-4 py-2 bg-[#062D76] text-white rounded cursor-pointer hover:bg-[#6C8299] transition duration-200 ease-in-out"
//                 >
//                   Đăng ký mượn ({selected.length})
//                 </button>
//               </div>
//             </footer>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default page;
