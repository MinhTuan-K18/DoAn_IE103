"use client";
import React from "react";

const MessageMinusIcon = () => (
  <svg
    width="35"
    height="35"
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex w-[35px] h-[35px] justify-center items-center"
    aria-hidden="true"
  >
    <path
      d="M10.5 17.5H24.5"
      stroke="#667085"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MaximizeIcon = () => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex w-[20px] h-[20px] justify-center items-center"
    aria-hidden="true"
  >
    <path
      d="M1.66675 7.99996V5.91663C1.66675 3.84163 3.34175 2.16663 5.41675 2.16663H7.50008"
      stroke="#667085"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 2.16663H14.5833C16.6583 2.16663 18.3333 3.84163 18.3333 5.91663V7.99996"
      stroke="#667085"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.3333 13.8334V15.0834C18.3333 17.1584 16.6583 18.8334 14.5833 18.8334H13.3333"
      stroke="#667085"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.50008 18.8333H5.41675C3.34175 18.8333 1.66675 17.1583 1.66675 15.0833V13"
      stroke="#667085"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChatHeader = () => {
  return (
    <header className="flex flex-col gap-2 items-start px-3 pt-0 border border-solid bg-slate-200">
      <div className="flex gap-1.5 justify-end self-end px-2.5 py-0">
        <button
          aria-label="Minimize chat"
          className="flex items-center justify-center"
        >
          <MessageMinusIcon />
        </button>
        <button
          aria-label="Maximize chat"
          className="flex items-center justify-center"
        >
          <MaximizeIcon />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;