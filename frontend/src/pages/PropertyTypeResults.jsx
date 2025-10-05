import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../components/Admin/AdminNavbar";
import { propertyApi } from "../utils/propertyApi";

export default function PropertyTypeResults() {
  const { type } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await propertyApi.getAllPropertiesForAdmin();
        if (data.success) {
          const decodedType = decodeURIComponent(type);
          const filtered = (data.properties || []).filter((p) => p.type === decodedType);
          setItems(filtered);
        } else {
          setError(data.message || "Failed to load properties");
        }
      } catch (e) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type]);

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40">
        <AdminNavbar />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-black mb-4">{type} Properties</h1>
        {loading ? (
          <div className="text-gray-700">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">No properties found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <div key={p._id} className="border rounded-xl overflow-hidden shadow-sm">
                <img src={(p.photos && p.photos[0]) || "https://via.placeholder.com/400x240"} alt={p.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-black">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.city}, {p.state}</p>
                  <p className="text-sm text-gray-900 mt-1">₹ {p.price}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async () => {
                        try {
                          const res = await propertyApi.verifyProperty(p._id, "Verified"); // ✅ pass status here
                          if (res.success) {
                            setItems((prev) =>
                              prev.map((it) =>
                                it._id === p._id ? { ...it, status: "Verified" } : it
                              )
                            );
                          } else {
                            alert(res.message || "Failed to verify");
                          }
                        } catch (err) {
                          alert(err.message || "Something went wrong");
                        }
                      }}
                      className="px-3 py-1 rounded bg-green-600 text-white text-sm"
                    >
                      Verify
                    </button>

                    <button
                      onClick={async () => {
                        const res = await propertyApi.suspendProperty(p._id);
                        if (res.success) {
                          setItems((prev) => prev.map((it) => (it._id === p._id ? { ...it, status: 'Suspended' } : it)));
                        } else {
                          alert(res.message || 'Failed to suspend');
                        }
                      }}
                      className="px-3 py-1 rounded bg-yellow-600 text-white text-sm"
                    >
                      Suspend
                    </button>
                    <button
                      onClick={async () => {
                        const res = await propertyApi.getPropertyById(p._id);
                        if (res.success) {
                          alert(`Property: ${res.property.name}`);
                        } else {
                          alert(res.message || 'Failed to fetch by id');
                        }
                      }}
                      className="px-3 py-1 rounded bg-gray-800 text-white text-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


