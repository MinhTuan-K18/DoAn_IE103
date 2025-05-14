import React from "react";

const CollectionCard = ({
  title,
  category,
  imageSrc,
  bgColor,
  buttonTextColor,
}) => {
  return (
    <article className="flex overflow-hidden relative flex-col self-stretch my-auto rounded-xl aspect-[1.158] h-full w-auto">
      <img
        src={imageSrc}
        alt=""
        className="object-cover max-md:size-full size-auto"
      />
      <div
        className={`absolute bottom-0 left-0 right-0 flex justify-between gap-5 px-[1.75rem] py-[1.5rem] w-full ${bgColor} max-md:px-5`}
      >
        <div className="text-white">
          <p className="text-base font-medium">{category}</p>
          <h2 className="mt-4 text-[1.125rem] font-semibold">{title}</h2>
        </div>
        <button
          className={`gap-2.5 self-start px-5 py-2.5 mt-5 text-sm font-semibold ${buttonTextColor} bg-white rounded-[99px]`}
        >
          Truy cập
        </button>
      </div>
    </article>
  );
};

export default CollectionCard;