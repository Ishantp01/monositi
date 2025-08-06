const projectInfo = [
  { label: "Project Size", value: "2 Acre" },
  { label: "Launch Date", value: "Aug 2022" },
  { label: "Total Units", value: "398" },
  { label: "Total Towers", value: "2" },
  { label: "BHK", value: "2,3 BHK" },
];

const AboutProject = () => (
  <section className="max-w-7xl mx-auto px-4 py-10">
    <h2 className="text-xl md:text-2xl font-semibold mb-6">About Amrutha Platinum Towers</h2>

    <p className="text-sm md:text-base text-gray-700 mb-6">
      Amrutha Platinum raises the skyline of Whitefield, one of Bangalore’s most coveted neighborhoods...
      {/* Truncate or replace with full content */}
    </p>

<div className="flex flex-wrap md:gap-4 gap-1 mb-6">
  {projectInfo.map((item, i) => (
    <div
      key={i}
      className="flex-grow-0 basis-[48%] md:basis-[31%] lg:basis-[23%] xl:basis-[18%] bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md px-4 py-3 text-center transition"
    >
      <p className="text-gray-500 text-xs sm:text-sm font-medium">
        {item.label}
      </p>
      <p className="text-gray-800 text-sm sm:text-base font-semibold mt-1">
        {item.value}
      </p>
    </div>
  ))}
</div>



  </section>
);

export default AboutProject;
