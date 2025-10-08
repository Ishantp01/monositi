import {
  Home,
  TreeDeciduous,
  Dumbbell,
  Bike,
  Zap,
  Waves,
  ArrowUpDown,
  Shield,
  TreePine,
  Car,
  Package,
  Users,
} from "lucide-react";
import MoreButton from "../common/MoreButton";

const amenities = [
  { name: "Club House", icon: Home },
  { name: "Jogging and Strolling Track", icon: TreeDeciduous },
  { name: "Outdoor Tennis Courts", icon: Dumbbell },
  { name: "Cycling & Jogging Track", icon: Bike },
  { name: "Power Back Up", icon: Zap },
  { name: "Swimming Pool", icon: Waves },
  { name: "Lift", icon: ArrowUpDown },
  { name: "Security", icon: Shield },
  { name: "Park", icon: TreePine },
  { name: "Reserved Parking", icon: Car },
  { name: "Service/Goods Lift", icon: Package },
  { name: "Visitor Parking", icon: Users },
];

const Amenities = () => (
  <section className="max-w-7xl mx-auto px-4 py-10">
    {/* Heading */}
    <h2 className="text-xl md:text-2xl font-semibold mb-6">
      Amenities Amrutha Platinum Towers
    </h2>

    {/* Amenities Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {amenities.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center border rounded-xl p-4 text-center text-sm bg-white shadow-sm hover:shadow-md hover:border-red-500 transition"
          >
            <Icon className="w-6 h-6 text-red-500 mb-2" />
            <p className="font-medium text-gray-700">{item.name}</p>
          </div>
        );
      })}
    </div>

    {/* Button */}
    <div className="mt-6 text-center">
      <MoreButton text="Contact Builder" />
    </div>
  </section>
);

export default Amenities;
