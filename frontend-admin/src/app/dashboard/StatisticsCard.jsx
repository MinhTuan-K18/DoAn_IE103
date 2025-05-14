import React from "react";

const StatisticsCard = ({ icon, title, value, percentage }) => {
  return (
    <article className="self-stretch px-3 pt-1 my-auto rounded-3xl bg-blue-950 h-full max-md:max-w-full">
      <header className="flex gap-3 items-center px-3 py-[1.25rem] w-full text-[1.25rem] text-white">
        {icon && (
          <img
            src={icon}
            alt=""
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[30px]"
          />
        )}
        <h2 className="flex-1 shrink gap-2.5 self-stretch my-auto basis-0 min-w-60">
          {title}
        </h2>
      </header>
      <section className="flex gap-3 items-center px-3 py-3.5 w-full text-[1.5rem] font-semibold text-white whitespace-nowrap">
        <p className="flex-1 shrink gap-2.5 self-stretch my-auto w-full basis-0 min-w-60">
          {value}
        </p>
      </section>
      
    </article>
  );
};

export default StatisticsCard; 