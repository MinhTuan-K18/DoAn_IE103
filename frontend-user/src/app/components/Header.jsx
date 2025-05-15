// "use client";
// import { usePathname } from "next/navigation";
// import {
//   Disclosure,
//   DisclosureButton,
//   DisclosurePanel,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuItems,
// } from "@headlessui/react";
// import { Menu as MenuIcon, X, Bell } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// const commonNavigation = [
//   { name: "Giới thiệu", href: "/About" },
//   { name: "Liên hệ", href: "/Contact" },
// ];

// const defaultNavigation = [
//   { name: "Trang chủ", href: "/" },
//   { name: "Thể loại", href: "/Categories" },
// ];

// const loginSignupNavigation = [
//   { name: "Đăng nhập", href: "/user-login" },
//   { name: "Đăng ký", href: "/user-signup" },
// ];

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// const Header = () => {
//   const pathname = usePathname();
//   const isAuthPage = pathname === "/user-login" || pathname === "/user-signup";

//   const navigation = isAuthPage
//     ? loginSignupNavigation.concat(commonNavigation)
//     : defaultNavigation.concat(commonNavigation);

//   return (
//     <header className="fixed top-0 left-0 w-full bg-[#7DBDE3] shadow-md z-50">
//   {/* Container logo riêng */}
//   <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pl-4">
//     <Image
//       src="/images/logo.jpg"
//       alt="Logo"
//       width={40}
//       height={40}
//       className="h-8 w-auto"
//     />
//   </div>

//   {/* Container chính cho navigation */}
//   <Disclosure as="nav">
//     {({ open }) => (
//       <>
//         <div className="w-full px-4 sm:px-6 lg:px-8">
//           <div className="flex h-16 items-center justify-right">
//             {/* Navigation links */}
//             <div className="hidden sm:flex items-center ml-17 space-x-8">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   aria-current={pathname === item.href ? "page" : undefined}
//                 >
//                   <span className="relative inline-block px-3 py-2 text-sm font-medium text-white hover:bg-[#345F79] hover:text-white">
//                     {item.name}
//                     {pathname === item.href && (
//                       <span className="absolute left-1/2 -translate-x-1/2 bottom-0 mt-1 block w-[70%] border-b-2 border-white" />
//                     )}
//                   </span>
//                 </Link>
//               ))}
//             </div>

//                 {/* Icon thông báo và Menu người dùng được đẩy sang phải */}
//                 {!isAuthPage && (
//                   <div className="hidden sm:flex items-center ml-auto space-x-8
//                   ">
//                     <button
//                       type="button"
//                       className="rounded-full bg-white p-1 text-blue-400"
//                     >
//                       <Bell className="h-6 w-6" aria-hidden="true" />
//                     </button>
//                     <Menu as="div" className="relative">
//                       <div>
//                         <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none">
//                           <Image
//                             className="h-8 w-8 rounded-full"
//                             src="/images/logo.jpg"
//                             alt="User Avatar"
//                             width={32}
//                             height={32}
//                           />
//                         </MenuButton>
//                       </div>
//                       <MenuItems className=" right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
//                         <MenuItem>
//                           {({ active }) => (
//                             <a
//                               href="#"
//                               className={classNames(
//                                 active ? "bg-gray-100" : "",
//                                 "block px-4 py-2 text-sm text-gray-700"
//                               )}
//                             >
//                               Hồ sơ của bạn
//                             </a>
//                           )}
//                         </MenuItem>
//                         <MenuItem>
//                           {({ active }) => (
//                             <a
//                               href="#"
//                               className={classNames(
//                                 active ? "bg-gray-100" : "",
//                                 "block px-4 py-2 text-sm text-gray-700"
//                               )}
//                             >
//                               Cài đặt
//                             </a>
//                           )}
//                         </MenuItem>
//                         <MenuItem>
//                           {({ active }) => (
//                             <a
//                               href="#"
//                               className={classNames(
//                                 active ? "bg-gray-100" : "",
//                                 "block px-4 py-2 text-sm text-gray-700"
//                               )}
//                             >
//                               Đăng xuất
//                             </a>
//                           )}
//                         </MenuItem>
//                       </MenuItems>
//                     </Menu>
//                   </div>
//                 )}

//                 {/* Nút menu Mobile */}
//                 <div className="sm:hidden ml-auto">
//                   <DisclosureButton className="inline-flex items-center justify-center p-2 text-white hover:bg-[#345F79]">
//                     <span className="sr-only">Open main menu</span>
//                     {open ? (
//                       <X className="h-6 w-6" />
//                     ) : (
//                       <MenuIcon className="h-6 w-6" />
//                     )}
//                   </DisclosureButton>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Menu Panel */}
//             <DisclosurePanel className="sm:hidden">
//               <div className="space-y-1 px-2 pb-3 pt-2">
//                 {navigation.map((item) => (
//                   <DisclosureButton
//                     key={item.name}
//                     as={Link}
//                     href={item.href}
//                     className={classNames(
//                       pathname === item.href
//                         ? "bg-[#345F79] text-white"
//                         : "text-white hover:bg-[#345F79] hover:text-white",
//                       "block rounded-md px-3 py-2 text-base font-medium"
//                     )}
//                     aria-current={pathname === item.href ? "page" : undefined}
//                   >
//                     {item.name}
//                   </DisclosureButton>
//                 ))}
//                 {/* Mobile: Container chứa icon thông báo và avatar */}
//                 {!isAuthPage && (
//                   <div className="flex items-center justify-evenly mt-4">
//                     <button
//                       type="button"
//                       className="rounded-full bg-white p-1 text-blue-400"
//                     >
//                       <Bell className="h-6 w-6" aria-hidden="true" />
//                     </button>
//                     <Menu as="div" className="relative">
//                       <div>
//                         <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none">
//                           <Image
//                             className="h-8 w-8 rounded-full"
//                             src="/images/logo.jpg"
//                             alt="User Avatar"
//                             width={32}
//                             height={32}
//                           />
//                         </MenuButton>
//                       </div>
//                       <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
//                         <MenuItem>
//                           {({ active }) => (
//                             <a
//                               href="#"
//                               className={classNames(
//                                 active ? "bg-gray-100" : "",
//                                 "block px-4 py-2 text-sm text-gray-700"
//                               )}
//                             >
//                               Hồ sơ của bạn
//                             </a>
//                           )}
//                         </MenuItem>
//                         <MenuItem>
//                           {({ active }) => (
//                             <a
//                               href="#"
//                               className={classNames(
//                                 active ? "bg-gray-100" : "",
//                                 "block px-4 py-2 text-sm text-gray-700"
//                               )}
//                             >
//                               Cài đặt
//                             </a>
//                           )}
//                         </MenuItem>
//                         <MenuItem>
//                           {({ active }) => (
//                             <a
//                               href="#"
//                               className={classNames(
//                                 active ? "bg-gray-100" : "",
//                                 "block px-4 py-2 text-sm text-gray-700"
//                               )}
//                             >
//                               Đăng xuất
//                             </a>
//                           )}
//                         </MenuItem>
//                       </MenuItems>
//                     </Menu>
//                   </div>
//                 )}
//               </div>
//             </DisclosurePanel>
//           </>
//         )}
//       </Disclosure>
//     </header>
//   );
// };

// export default Header;

"use client";
import { usePathname } from "next/navigation";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Menu as MenuIcon, X, Bell, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Thể loại", href: "/Categories" },
  { name: "Giới thiệu", href: "/About" },
  { name: "Hỗ trợ", href: "/Help" },
];

const CartBadge = ({ count }) => {
  return (
    <div
      className="absolute self-center items-center right-0.5 px-1 text-[0.65rem] font-medium text-center justify-center text-white bg-[#F7302E] rounded-full"
      role="status"
      aria-label={`${count} books`}
    >
      {count}
    </div>
  );
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [cartCount, setCartCount] = useState();

  const user = JSON.parse(localStorage.getItem("persist:root")); // lấy thông tin người dùng từ localStorage

  // const fetchCart = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/cart/${user.id}`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       const booksInCart = data.data || [];
  //       setCartCount(booksInCart.length);
  //     } else {
  //       console.error("Lỗi khi lấy giỏ hàng");
  //     }
  //   } catch (error) {
  //     console.error("Có lỗi xảy ra:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCart();
  // }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("persist:root");
    router.push("/user-login");
  };

  return (
    <header className="bg-[#062D76] text-white shadow-lg fixed top-0 left-0 w-full z-50">
      <Disclosure as="nav" className="mx-auto">
        {({ open }) => (
          <>
            <div className="flex justify-between items-center h-14 px-2 md:px-5">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/">
                  {/* <Image
                    alt="Logo"
                    src="/images/logo.jpg"
                    width={40}
                    height={40}
                    className="h-10 w-auto rounded-full"
                  /> */}
                  <h1 className="text-3xl font-bold text-white font-[Moul]">
                    OurLogo
                  </h1>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden sm:flex space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-lg font-medium transition duration-200 ${
                      pathname === item.href
                        ? "bg-white text-[#052259]"
                        : "hover:bg-white hover:text-[#052259]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Right Icons */}
              <div className="flex items-center space-x-4">
                <button
                  className={`relative pr-2 pl-1.5 py-2 rounded-full cursor-pointer hover:bg-white hover:text-[#052259] ${
                    pathname === "/cart"
                      ? "bg-white text-[#052259]"
                      : "hover:bg-white hover:text-[#052259]"
                  }`}
                >
                  <Link href="/cart">
                    <CartBadge count={cartCount} />
                    <ShoppingCart
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        strokeWidth: "1.5px",
                      }}
                      className="size-6"
                    />
                  </Link>
                </button>

                <button
                  className={`relative p-2 rounded-full cursor-pointer hover:bg-white hover:text-[#052259] ${
                    pathname === "/notifications"
                      ? "bg-white text-[#052259]"
                      : "hover:bg-white hover:text-[#052259]"
                  }`}
                >
                  <Link href="/notifications">
                    <Bell
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        strokeWidth: "1.5px",
                      }}
                      className="size-6"
                    />
                  </Link>
                </button>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full">
                    <Image
                      alt="User"
                      src="/images/logo.jpg"
                      width={40}
                      height={40}
                      className="size-10 rounded-full border-2 border-white cursor-pointer"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5">
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          href="/user-profile"
                          className={`block px-4 py-2 text-gray-700 ${
                            active && "bg-gray-100"
                          }`}
                        >
                          Hồ sơ của bạn
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          href="/settings"
                          className={`block px-4 py-2 text-gray-700 ${
                            active && "bg-gray-100"
                          }`}
                        >
                          Cài đặt
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-2 text-gray-700 ${
                            active && "bg-gray-100"
                          }`}
                        >
                          Đăng xuất
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <DisclosureButton className="p-2 rounded-md hover:bg-blue-700">
                  {open ? (
                    <X className="size-6" />
                  ) : (
                    <MenuIcon className="size-6" />
                  )}
                </DisclosureButton>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <DisclosurePanel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                      pathname === item.href
                        ? "bg-white text-[#052259]"
                        : "hover:bg-blue-700 hover:text-gray-100"
                    }`}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </header>
  );
};

export default Header;
