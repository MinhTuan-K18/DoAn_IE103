// "use client"
// import React, { useState, useEffect, use } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import LeftSideBar from "../components/LeftSideBar";
// //import axios from "axios";

// const ChangePassword = () => {
//   const [user, setUser] = useState({ name: "", email: "", avatar: "" });
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
//   useEffect(() => {
//     // Giả lập API call để lấy thông tin user từ backend
//     setUser({ name: "Vy Đỗ", email: "Vyhap@gmail.com", avatar: "/images/logo. jpg" });
//   }, []);


// return (
//   <div className="flex min-h-screen bg-[#EFF3FB]">
//     <LeftSideBar />
//     {/* Container bọc form - flex-1 để đẩy form qua phải, 
//           justify-end để form sát phải, items-end để form sát đáy */}
//       <div className="flex-1 flex justify-end items-end">
//         {/* Bỏ mt-5 để form không bị đẩy lên, dùng mb-0 để dính sát đáy */}
//         <div className="bg-white w-full max-w-[1330px] h-[623px] p-18 mr-0 mb-0 rounded-lg shadow-md">
//           <div className="flex items-center gap-4 mb-6">
//             <img
//               className="w-20 h-20 rounded-full"
//               //src={user.avatar}
//               src="/images/logo.jpg"
//               alt="Avatar"
//             />
//             <div>
//               <h3 className="text-xl font-semibold">{user.name}</h3>
//               <p className="text-gray-500">{user.email}</p>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-black">Mật khẩu hiện tại</label>
//             <div className="relative">
//               <input
//                 type={showCurrentPassword ? "text" : "password"}
//                 className="w-full p-2 border rounded mt-1 pr-10"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-3 flex items-center"
//                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//               >
//                 {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//               </button>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-black">Mật khẩu mới</label>
//             <div className="relative">
//               <input
//                 type={showNewPassword ? "text" : "password"}
//                 className="w-full p-2 border rounded mt-1 pr-10"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-3 flex items-center"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//               >
//                 {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//               </button>
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="block text-black">Xác nhận mật khẩu</label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 className="w-full p-2 border rounded mt-1 pr-10"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-3 flex items-center"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//               </button>
//             </div>
//           </div>

//           <div className="text-center">
//             <button className="w-[200px] mx-auto bg-[#6CB1DA] text-white p-3 rounded-lg hover:bg-blue-400">
//               Cập nhật tài khoản
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangePassword;


