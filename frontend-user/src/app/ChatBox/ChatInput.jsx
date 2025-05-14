"use client";
import React from "react";
const SendIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex w-[30px] h-[30px] justify-center items-center"
    aria-hidden="true"
  >
    <mask
      id="mask0_411_2486"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="2"
      y="3"
      width="25"
      height="26"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5 3.75049H26.8738V28.1242H2.5V3.75049Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask0_411_2486)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5062 18.5223L18.0774 25.9385C18.2774 26.2635 18.5899 26.2598 18.7162 26.2423C18.8424 26.2248 19.1462 26.1473 19.2562 25.7785L24.9724 6.47228C25.0724 6.13103 24.8887 5.89853 24.8062 5.81603C24.7262 5.73353 24.4974 5.55728 24.1662 5.65103L4.84618 11.3085C4.47993 11.416 4.39993 11.7235 4.38243 11.8498C4.36493 11.9785 4.35993 12.2973 4.68368 12.501L12.1849 17.1923L18.8124 10.4948C19.1762 10.1273 19.7699 10.1235 20.1387 10.4873C20.5074 10.851 20.5099 11.446 20.1462 11.8135L13.5062 18.5223ZM18.6187 28.1248C17.7487 28.1248 16.9512 27.6823 16.4812 26.9223L11.6349 19.0585L3.68993 14.0898C2.83368 13.5535 2.38618 12.5985 2.52493 11.5948C2.66243 10.591 3.35118 9.79353 4.31868 9.50978L23.6387 3.85228C24.5274 3.59228 25.4799 3.83853 26.1349 4.49103C26.7899 5.14978 27.0337 6.11228 26.7687 7.00478L21.0524 26.3098C20.7662 27.281 19.9662 27.9673 18.9649 28.101C18.8474 28.116 18.7337 28.1248 18.6187 28.1248V28.1248Z"
        fill="#062D76"
      />
    </g>
  </svg>
);


const ChatInput = ({ message, onMessageChange, onSend }) => {
  return (
    <footer className="flex gap-3 items-center p-1.5 bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 text-[1.125rem] leading-8 text-gray-500 outline-none"
      />
      <button
        onClick={onSend}
        aria-label="Send message"
        className="flex items-center justify-center cursor-pointer"
      >
        <SendIcon />
      </button>
    </footer>
  );
};

export default ChatInput;