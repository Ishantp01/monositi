import React from "react";

export default function PgCard({data}) {
  return (
    <div className="relative w-80 h-52 rounded-xl overflow-hidden shadow-md">
      <img
        src={data.image}
        alt={data.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70 flex flex-col justify-end items-start p-5 text-white">
        <h3 className="text-lg font-semibold">{data.title}</h3>
        <button className="mt-2 text-sm underline hover:text-gray-300">
          {data.buttonText}
        </button>
      </div>
    </div>
  );
}
