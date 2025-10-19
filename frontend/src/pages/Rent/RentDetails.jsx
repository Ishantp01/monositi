import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import HeroCard from "../../components/Rent/HeroCard";
import { FilterBar } from "../../components/Rent/FilterBar";
import ContactOwner from "../../components/Rent/ContactOwner";
import FlatOff from "../../components/Rent/FlatOff";
import MoreDetailsSec from "../../components/Rent/MoreDetail";

import { AboutProject } from "../../components/Rent/AboutProject";
import Amenities from "../../components/Rent/Amenities";
import { propertyApi } from "../../utils/propertyApi";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

function RentDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProperties, setSimilarProperties] = useState([]);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
      fetchSimilarProperties();
    }
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await propertyApi.getPropertyById(id);

      if (response.success) {
        setProperty(response.property);
      } else {
        toast.error("Property not found");
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      toast.error("Error loading property details");
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProperties = async () => {
    try {
      const response = await propertyApi.searchProperties({
        sub_category: 'Rent',
        limit: 4
      });

      if (response.success) {
        // Filter out current property and limit to 4
        const filtered = response.properties
          .filter(p => p._id !== id)
          .slice(0, 4);
        setSimilarProperties(filtered);
      }
    } catch (error) {
      console.error("Error fetching similar properties:", error);
    }
  };
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#f73c56] mx-auto mb-4" />
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
            <p className="text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section>
        <div className="bg-red-50">
          <FilterBar />
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
            {/* HeroCard wider */}
            <div className="lg:col-span-3 ">
              <HeroCard property={property} />
              <MoreDetailsSec property={property} />
              <AboutProject property={property} />
              <Amenities property={property} />
            </div>

            {/* Sidebar smaller */}
            <div className="flex flex-col gap-4">
              <div className="scale-90">
                <ContactOwner property={property} />
              </div>
              <div className="scale-90">
                <FlatOff property={property} />
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="container mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Rental Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((similarProperty) => (
                <div key={similarProperty._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-video bg-gray-200">
                    {similarProperty.property_features?.images?.[0] ? (
                      <img
                        src={similarProperty.property_features.images[0]}
                        alt={similarProperty.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-400 rounded"></div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {similarProperty.name || `${similarProperty.type} Property`}
                    </h3>
                    <div className="text-[#f73c56] font-bold mb-2">
                      ₹{similarProperty.price.toLocaleString()}/month
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <span>{similarProperty.city}, {similarProperty.state}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default RentDetails;
