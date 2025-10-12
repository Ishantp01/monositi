import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import Carousel from "../components/Carousel/Carousel";
import StandardPropertySlider from "../components/sliders/StandardPropertySlider";
import DynamicFilterBar from "../components/Tabs/DynamicFilterBar";

import PropertySearch from "../components/Tabs/Tabs";

// Sample properties for demonstration
const sampleProperties = [
  {
    _id: "1",
    title: "Luxury Apartment with Sea View",
    price: 25000,
    address: { area: "Marine Drive", city: "Mumbai" },
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    isVerified: true,
    photos: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    _id: "2",
    title: "Modern Villa with Private Pool",
    price: 45000,
    address: { area: "Jubilee Hills", city: "Hyderabad" },
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    isVerified: true,
    photos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    _id: "3",
    title: "Spacious Penthouse in City Center",
    price: 35000,
    address: { area: "Koramangala", city: "Bangalore" },
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    isVerified: true,
    photos: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    _id: "4",
    title: "Cozy Studio Apartment",
    price: 15000,
    address: { area: "Indiranagar", city: "Bangalore" },
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    isVerified: false,
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="relative">
        <div className="mt-14 md:mt-24">
          <Carousel interval={8000} />
        </div>
        {/* <HeroSearchBar /> */}
        <PropertySearch />

        {/* Featured Properties */}
        {/* <FeaturedProperties /> */}

        {/* Quick Categories */}
        {/* <QuickCategories /> */}

        {/* Recent Properties */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <StandardPropertySlider
              properties={sampleProperties}
              title="Recent Properties"
              subtitle="Explore the latest additions to our property listings"
            />
          </div>
        </div>

        {/* Services Teaser */}
        {/* <ServicesTeaser /> */}

        {/* Testimonials */}
        {/* <Testimonials /> */}

        <Footer />
      </div>
    </>
  );
};

export default Home;
