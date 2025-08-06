import MoreButton from "../../components/MoreButton"


const amenities = [
  "Club House", "Jogging and Strolling Track", "Outdoor Tennis Courts", "Cycling & Jogging Track",
  "Power Back Up", "Swimming Pool", "Lift", "Security", "Park", "Reserved Parking",
  "Service/Goods Lift", "Visitor Parking"
];

const Amenities = () => (
  <section className="max-w-7xl mx-auto px-4 py-10">
    <h2 className="text-xl md:text-2xl font-semibold mb-6">
      Amenities Amrutha Platinum Towers
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {amenities.map((item, i) => (
        <div
          key={i}
          className="border rounded-xl text-center text-sm p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="text-red-500 text-2xl mb-2">🎯</div> {/* Replace with real icons */}
          <p>{item}</p>
        </div>
      ))}
    </div>
    <div className="mt-6">
      <MoreButton text="Contact Builder"  />
    </div>
  </section>
);

export default Amenities;
