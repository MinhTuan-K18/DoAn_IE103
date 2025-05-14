"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState(null);
  const [filterUsers, setFilterUsers] = useState([]);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [deleteOne, setDeleteOne] = useState(null);
  const handleSearch = () => {
    if (searchQuery) {
      const filterUser = userList.filter((user) =>
        user.MaSach.toString() === searchQuery || //tìm theo id
        user?.TenSach.toLowerCase().includes(searchQuery.toLowerCase()) || //tìm theo tên sách
        user?.MaTheLoai?.toLowerCase().includes(searchQuery.toLowerCase()) //tìm theo nội dung bài viết
          ? user
          : null
      );
      if (filterUser.length < 1) toast.error("Không tìm thấy kết quả");
      setFilterUsers(filterUser);
    } else {
      setFilterUsers([]);
    }
  };
  const route = useRouter();
  const handleAddUser = () => {
    route.push(`/users/addUser`);
  };
  const handleEdit = (MaND) => {
    route.push(`/users/${MaND}`);
  };

  const fetchUser = async () => {
    const test = [
      {
        MaND: "1",
        TenND: "Nguyễn Lê Thanh Huyền",
        VaiTro: "Admin",
        HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
      },
      {
        MaND: "2",
        TenND: "Nguyễn Thị Hoàng Yến",
        VaiTro: "Admin",
        HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
      },
      {
        MaND: "3",
        TenND: "Đỗ Mai Tường Vy",
        VaiTro: "Admin",
        HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
      },
      {
        MaND: "4",
        TenND: "Nguyễn Hữu Huy",
        VaiTro: "Admin",
        HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
      },
    ];
    setUserList(test);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDelete = async (book) => {
    //Gọi API...
    //await fetchBook()
    setDeleteOne(null);
    setPopUpOpen(false);
    toast.success("Xóa user thành công");
  };

  const UserCard = ({ user }) => {
    return (
      <div className="flex bg-white w-full rounded-lg mt-2 relative drop-shadow-lg p-5 gap-[20px] md:gap-[50px] items-center">
        <img src={`${user.HinhAnh[0]}`} className="w-[145px] h-[205px]" />
        <div className="flex flex-col gap-[10px] relative w-full">
          <p className="">ID:&nbsp;{user.MaND}</p>
          <p className="font-bold">{user.TenND}</p>
          <p className="">Vai trò:&nbsp;{user.VaiTro}</p>
          <div className="w-full flex justify-end gap-5 md:gap-10">
            <Button
              className="w-10 md:w-40 h-10 bg-[#062D76] hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                handleEdit(user.MaND);
              }}
            >
              <Pencil className="w-5 h-5" color="white" />
              <p className="hidden md:block">Sửa người dùng</p>
            </Button>
            <Button
              className="w-10 md:w-40 h-10 bg-[#D66766] hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setDeleteOne(user);
                setPopUpOpen(true);
              }}
            >
              <Trash2 className="w-5 h-5" color="white" />
              <p className="hidden md:block">Xóa người dùng</p>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row w-full h-full bg-[#EFF3FB]">
      <Sidebar />
      <div className="flex w-full flex-col py-6 md:ml-52 relative mt-5 gap-2 items-center px-10">
        <div className="flex w-full items-center h-[10px] justify-between mb-10">
          <div className="flex gap-5">
            <Input
              type="text"
              placeholder="Tìm kiếm người dùng"
              className="w-sm md:w-3xl h-10 font-thin italic text-black text-2xl bg-white rounded-[10px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              className="w-10 h-10 cursor-pointer text-[20px] bg-[#062D76] hover:bg-gray-700 font-bold rounded-[10px] overflow-hidden"
              onClick={() => {
                handleSearch();
              }}
            >
              <Search className="w-10 h-10" color="white" />
            </Button>
          </div>
          <Button
            className="w-40 h-10 cursor-pointer bg-[#062D76] hover:bg-gray-700 font-bold rounded-[10px] overflow-hidden"
            onClick={() => {
              handleAddUser();
            }}
          >
            <Plus className="w-5 h-5" color="white" />
            Thêm người dùng
          </Button>
        </div>
        {userList &&
          (filterUsers.length > 0 //nếu đang search thì hiện danh sách lọc
            ? filterUsers.map((user) => {
                return <UserCard key={user?.MaND} user={user} />;
              })
            : userList.map((user) => {
                return <UserCard key={user?.MaND} user={user} />;
              }))}
      </div>
      {popUpOpen && (
        <div className="fixed inset-0 items-center justify-center z-100 flex">
          <div className="w-full h-full bg-black opacity-[80%] absolute top-0 left-0"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-120 fixed">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
            <div className="flex bg-white w-full rounded-lg mt-2 relative p-5 gap-[20px] md:gap-[50px] items-center">
              <img
                src={`${deleteOne.HinhAnh[0]}`}
                className="w-[145px] h-[205px]"
              />
              <div className="flex flex-col gap-[10px] relative w-full">
                <p className="">ID:&nbsp;{deleteOne.MaND}</p>
                <p className="font-bold">{deleteOne.TenND}</p>
                <p className="italic">Vai trò:&nbsp;{deleteOne.VaiTro}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                className="bg-gray-500 hover:bg-gray-700 text-white"
                onClick={() => setPopUpOpen(false)}
              >
                Hủy
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-700 text-white"
                onClick={() => {
                  handleDelete(deleteOne);
                }}
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;