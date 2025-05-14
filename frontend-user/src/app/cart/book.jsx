"use client";
import React from "react";
import { useRouter } from "next/navigation";

const StatusIndicator = ({ available }) => (
  <div className="flex gap-1.5 justify-center items-center self-start px-2 py-1 rounded bg-slate-200">
    <span className="text-sm font-medium text-[#062D76] w-fit">
      {available ? "Còn sẵn" : "Đã hết"}
    </span>
    <div
      className={`flex shrink-0 w-4 h-4 rounded-full ${
        available ? "bg-green-400" : "bg-[#F7302E]"
      }`}
    />
  </div>
);

const BookCard = ({
  id,
  imageSrc,
  available,
  title,
  author,
  publisher,
  borrowCount,
  checked = false,          
  onCheck = () => {},        
}) => {
  const router = useRouter();

  const slugifyTitle = (str) =>
    str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

  /** Khi click vào card (trừ checkbox) */
  const handleCardClick = () => {
    router.push(`/book-detail/${id}`);
  };

  /** Ngăn click checkbox lan ra thẻ <article> */
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <article
      className="relative flex gap-5 min-w-60 rounded-2xl py-5 shadow-sm "
  
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer accent-[#F7302E]"
        checked={checked}
        onChange={(e) => onCheck(e.target.checked)}
        onClick={stopPropagation}
      />

      <img
        src={imageSrc}
        alt={title}
        className="ml-12 w-[100px] aspect-[0.67] object-cover rounded-sm cursor-pointer"
        onClick={handleCardClick}
      />

      <div className="flex flex-col flex-1 cursor-pointer" onClick={handleCardClick}>
      <StatusIndicator available={available} />
        <h3 className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-[1.125rem] font-medium text-black basis-0">
          {title}
        </h3>
        <p className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-base text-black basis-0">
          Tác giả: {author}
        </p>
        <p className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-base text-black basis-0">
          NXB: {publisher}
        </p>
        <p className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-base text-black basis-0">
          Lượt mượn: {borrowCount}
        </p>
      </div>
    </article>
  );
};

export default BookCard;