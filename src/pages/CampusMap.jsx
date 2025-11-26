import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getBuildings, getFloors, getRooms } from "../services/api";
import { Link } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";

// Component to update map view dynamically
function MapViewUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

const CampusMap = () => {
  const collegeBuilding = {
    _id: "college_1",
    name: "Sigma College",
    description: "Main Campus",
    latitude: 22.324651052939384,
    longitude: 73.28028071911696
  };

  const [buildings, setBuildings] = useState([collegeBuilding]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([collegeBuilding.latitude, collegeBuilding.longitude]);
  const [mapZoom, setMapZoom] = useState(15);

  // Map ref for flyTo
  const mapRef = useRef();

  // Fetch buildings and setup live location
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await getBuildings();
        setBuildings((prev) => [...prev, ...response.data.filter(b => b._id !== collegeBuilding._id)]);
        if (response.data.length > 0) {
          setMapCenter([response.data[0].latitude, response.data[0].longitude]);
        }
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };
    fetchBuildings()

    // Live location tracking
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setCurrentLocation(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Fetch floors
  useEffect(() => {
    const fetchFloors = async () => {
      if (!selectedBuilding) return;
      try {
        const response = await getFloors(selectedBuilding);
        setFloors(response.data);
        if (response.data.length > 0) setSelectedFloor(response.data[0]._id);
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };
    fetchFloors();
  }, [selectedBuilding]);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedBuilding || !selectedFloor) return;
      try {
        const response = await getRooms({ building_id: selectedBuilding, floor_id: selectedFloor });
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, [selectedBuilding, selectedFloor]);

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building._id);
    setMapCenter([building.latitude, building.longitude]);
    setMapZoom(18);
    // Fly animation
    if (mapRef.current) {
      mapRef.current.flyTo([building.latitude, building.longitude], 18, { animate: true, duration: 2 });
    }
  };

  const handleShowUserLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.flyTo(currentLocation, 18, { animate: true, duration: 2 });
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Campus Map</h2>

        {/* Buildings */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Buildings</h3>
          <div className="space-y-2">
            {buildings.map((b) => (
              <button
                key={b._id}
                onClick={() => handleBuildingClick(b)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedBuilding === b._id
                    ? "bg-primary-100 border-primary-500"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="text-sm text-gray-600">{b.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Floors */}
        {selectedBuilding && floors.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Floors</h3>
            <div className="space-y-2">
              {floors.map((floor) => (
                <button
                  key={floor._id}
                  onClick={() => setSelectedFloor(floor._id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedFloor === floor._id
                      ? "bg-primary-100 border-primary-500"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {floor.floor_name || `Floor ${floor.floor_number}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rooms */}
        {rooms.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Rooms</h3>
            <div className="space-y-2">
              {rooms.map((room) => (
                <Link
                  key={room._id}
                  to={`/room/${room._id}`}
                  className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <p className="font-medium">{room.room_no}</p>
                  <p className="text-sm text-gray-600">{room.type}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Show My Location */}
        {currentLocation && (
          <button
            onClick={handleShowUserLocation}
            className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
          >
            Show My Location
          </button>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <MapViewUpdater center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }}>
  <MapViewUpdater center={mapCenter} zoom={mapZoom} />
  
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {/* College Marker */}
  <Marker position={[collegeBuilding.latitude, collegeBuilding.longitude]}>
    <Popup>
      <h3 className="font-semibold">{collegeBuilding.name}</h3>
      <p className="text-sm">{collegeBuilding.description}</p>
      <Link to={`/building/${collegeBuilding._id}`} className="text-primary-600 hover:underline">
        View Details
      </Link>
    </Popup>
  </Marker>

  {/* Agar buildings aur user location bhi dikhana hai */}
  {buildings.map((b) => b._id !== collegeBuilding._id && (
    <Marker key={b._id} position={[b.latitude, b.longitude]}>
      <Popup>
        <h3 className="font-semibold">{b.name}</h3>
        <p className="text-sm">{b.description}</p>
      </Popup>
    </Marker>
  ))}

  {currentLocation && (
    <Marker position={currentLocation}>
      <Popup className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-primary-600" />
        <span>You are here</span>
      </Popup>
    </Marker>
  )}
</MapContainer>

          {/* Buildings */}
          {buildings.map((b) => (
            <Marker key={b._id} position={[b.latitude, b.longitude]}>
              <Popup>
                <h3 className="font-semibold">{b.name}</h3>
                <p className="text-sm">{b.description}</p>
                <Link to={`/building/${b._id}`} className="text-primary-600 hover:underline">
                  View Details
                </Link>
              </Popup>
            </Marker>
          ))}

          {/* User Location */}
          {currentLocation && (
            <Marker position={currentLocation}>
              <Popup className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <span>You are here</span>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default CampusMap;
