import React from "react";


const ChatBubbleIcon = () => (
  <svg
    width="306"
    height="30"
    viewBox="0 0 306 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex items-center gap-[7px] self-stretch"
    aria-hidden="true"
  >
    <path
      d="M25.803 15C25.803 22.4858 20.1098 28.5 13.1515 28.5C6.19326 28.5 0.5 22.4858 0.5 15C0.5 7.51425 6.19326 1.5 13.1515 1.5C20.1098 1.5 25.803 7.51425 25.803 15Z"
      fill="white"
      stroke="#052259"
    />
    <path
      d="M16.0104 8.91309H10.2924C8.71419 8.91309 7.43335 10.2705 7.43335 11.9444V15.5844V16.1931C7.43335 17.867 8.71419 19.2244 10.2924 19.2244H11.1501C11.3045 19.2244 11.5103 19.334 11.6075 19.4679L12.4652 20.6792C12.8426 21.2148 13.4602 21.2148 13.8376 20.6792L14.6953 19.4679C14.8039 19.3157 14.9755 19.2244 15.1527 19.2244H16.0104C17.5886 19.2244 18.8695 17.867 18.8695 16.1931V11.9444C18.8695 10.2705 17.5886 8.91309 16.0104 8.91309ZM10.8642 15C10.544 15 10.2924 14.7261 10.2924 14.3913C10.2924 14.0566 10.5497 13.7827 10.8642 13.7827C11.1787 13.7827 11.436 14.0566 11.436 14.3913C11.436 14.7261 11.1844 15 10.8642 15ZM13.1514 15C12.8312 15 12.5796 14.7261 12.5796 14.3913C12.5796 14.0566 12.8369 13.7827 13.1514 13.7827C13.4659 13.7827 13.7232 14.0566 13.7232 14.3913C13.7232 14.7261 13.4716 15 13.1514 15ZM15.4386 15C15.1184 15 14.8668 14.7261 14.8668 14.3913C14.8668 14.0566 15.1241 13.7827 15.4386 13.7827C15.7531 13.7827 16.0104 14.0566 16.0104 14.3913C16.0104 14.7261 15.7588 15 15.4386 15Z"
      fill="#003DF5"
    />
    <text
      fill="#052259"
      xmlSpace="preserve"
      style={{ whiteSpace: "pre" }}
      fontFamily="Montserrat"
      fontSize="12"
      letterSpacing="0em"
    >
      <tspan x="33.303" y="19.302">
        Livechat 02:10 PM
      </tspan>
    </text>
  </svg>
);

const ChatMessage = ({ message, isVisitor, timestamp, isRead }) => {
  return (
    <div className="flex flex-col gap-1 items-start">
    <div className="flex flex-col gap-2.5 items-start">
      <ChatBubbleIcon />
    </div>

    <div className={`flex flex-col ${isVisitor ? "items-end" : "items-start"}`}>

      {isVisitor && (
        <time className="text-xs leading-8 text-right text-[#062D76]">
          {timestamp}
        </time>
      )}
      <div
        className={`gap-2.5 p-2.5 text-sm leading-8 rounded-xl border ${
          isVisitor
            ? "text-white bg-sky-900 border-[1px_solid_#052259]"
            : "text-blue-950 bg-white border-[1px_solid_#B2BED5]"
        }`}
      >
        {message}
      </div>
      {isVisitor && isRead && (
        <span className="text-xs leading-8 text-[#062D76]">Read</span>
      )}
    </div>
    </div>
  );
};

export default ChatMessage; 