"use client";

import { useState } from "react";

interface Props {
  name: string;
  type: string;
  id?: string;
  value?: string;
  placeholder: string;
  icon: string;
  disable?: boolean;
}

export default function InputBox({
  disable = false,
  name,
  type,
  id,
  value,
  placeholder,
  icon,
}: Props) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-full mb-6">
      <input
        type={type === "password" ? (passwordVisible ? "text" : "password") : type}
        name={name}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        disabled={disable}
        className="w-full rounded-lg p-4 pl-12 bg-white border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder:text-gray-500 text-gray-800"
      />
      <i
        className={`fi ${icon} absolute left-4 top-1/2 -translate-y-1/2 text-gray-500`}
      ></i>
      {type === "password" && (
        <i
          className={`fi ${
            passwordVisible ? "fi-rr-eye" : "fi-rr-eye-crossed"
          } absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer text-gray-500`}
          onClick={() => setPasswordVisible((prev) => !prev)}
        ></i>
      )}
    </div>
  );
}