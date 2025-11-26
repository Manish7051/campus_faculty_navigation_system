import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Map, Users, Building2, Search, ArrowRight } from "lucide-react";
import SearchBar from "../components/SearchBar";
import QRScanner from "../components/QRScanner";
import { getBuildings, getFacilities, getDepartments } from "../services/api";

const Home = () => {
  const [buildings, setBuildings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingsRes, facilitiesRes, deptsRes] = await Promise.all([
          getBuildings(),
          getFacilities(),
          getDepartments(),
        ]);
        setBuildings(buildingsRes.data.slice(0, 6));
        setFacilities(facilitiesRes.data.slice(0, 8));
        setDepartments(deptsRes.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const quickLinks = [
    { path: "/map", label: "Campus Map", icon: Map, color: "bg-blue-500" },
    {
      path: "/faculty",
      label: "Faculty Directory",
      icon: Users,
      color: "bg-green-500",
    },
    {
      path: "/facilities",
      label: "Facilities",
      icon: Building2,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Campus & Faculty Navigation System
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            Find your way around campus, locate faculty, and discover facilities
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar onResults={setSearchResults} />
            </div>
            <QRScanner />
          </div>
        </div>
      </div>
      {/* Search Results */}
      {searchResults && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Search Results
            </h2>

            {/* If ALL are empty */}
            {!searchResults.buildings?.length &&
              !searchResults.faculty?.length &&
              !searchResults.rooms?.length && (
                <div className="text-center py-10">
                  <p className="text-xl font-semibold text-gray-600">
                    ❌ No results found for your search.
                  </p>
                  <p className="text-gray-500 mt-2">
                    Try searching with a different keyword.
                  </p>
                </div>
              )}

            <div className="space-y-10">
              {/* BUILDINGS */}
              {searchResults.buildings?.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Buildings
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.buildings.map((building) => (
                      <Link
                        key={building._id}
                        to={`/building/${building._id}`}
                        className="p-5 border rounded-xl shadow-sm hover:shadow-md hover:border-blue-500/50 transition duration-200 bg-gray-50"
                      >
                        <p className="font-medium text-gray-800 text-lg">
                          {building.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* FACULTY */}
              {searchResults.faculty?.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Faculty
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.faculty.map((f) => (
                      <Link
                        key={f._id}
                        to={`/faculty/${f._id}`}
                        className="p-5 border rounded-xl shadow-sm hover:shadow-md hover:border-blue-500/50 transition duration-200 bg-gray-50"
                      >
                        <p className="font-medium text-gray-800 text-lg">
                          {f.name}
                        </p>
                        <p className="text-gray-600 text-sm">{f.designation}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* ROOMS */}
              {searchResults.rooms?.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Rooms
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.rooms.map((room) => (
                      <Link
                        key={room._id}
                        to={`/room/${room._id}`}
                        className="p-5 border rounded-xl shadow-sm hover:shadow-md hover:border-blue-500/50 transition duration-200 bg-gray-50"
                      >
                        <p className="font-medium text-gray-800 text-lg">
                          Room {room.roomNumber}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Floor: {room.floorNumber}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}{" "}
      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`${link.color} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between`}
              >
                <div className="flex items-center space-x-4">
                  <Icon className="h-8 w-8" />
                  <span className="text-xl font-semibold">{link.label}</span>
                </div>
                <ArrowRight className="h-6 w-6" />
              </Link>
            );
          })}
        </div>
      </div>
      {/* Popular Locations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Popular Buildings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {buildings.map((building) => (
            <Link
              key={building._id}
              to={`/building/${building._id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{building.name}</h3>
              <p className="text-gray-600">
                {building.description || "Building details"}
              </p>
            </Link>
          ))}
        </div>
      </div>
      {/* Facilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Facilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {facilities.map((facility) => (
            <Link
              key={facility._id}
              to={`/facilities`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <h3 className="font-semibold">{facility.name}</h3>
              <p className="text-sm text-gray-600">{facility.type}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
