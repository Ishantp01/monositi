import React from "react";

export default function PropertyCard2({ data, area = true }) {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm mx-auto overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <img
        src={data.image}
        alt={data.bhk}
        className="h-44 w-full object-cover"
        loading="lazy"
      />

      <div className="p-4">
        <div className="text-base font-semibold text-gray-900">{data.bhk}</div>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="text-lg font-extrabold text-black">
            {formatINR(data.price)}
          </span>
          {
            area ? (
              <>
                <span aria-hidden className="h-4 w-px bg-slate-900" />

                <span className="text-lg font-extrabold text-black">
                  {data?.area}
                  <span className="ml-1 font-bold">{data?.unit}</span>
                </span>
              </>
            ) : null
          }

        </div>

        <div className="mt-3 text-gray-400">{data.location}</div>
        <div className="mt-3 text-gray-400">{data.status}</div>
      </div>
    </div>
  );
}
