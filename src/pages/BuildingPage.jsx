import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building2, Layers } from 'lucide-react';
import { getBuilding, getFloors, getRooms } from '../services/api';

const BuildingPage = () => {
  const { id } = useParams();
  const [building, setBuilding] = useState(null);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState({});
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingRes, floorsRes] = await Promise.all([
          getBuilding(id),
          getFloors(id)
        ]);
        setBuilding(buildingRes.data);
        setFloors(floorsRes.data);
        if (floorsRes.data.length > 0) {
          setSelectedFloor(floorsRes.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching building data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedFloor) {
        try {
          const response = await getRooms({
            building_id: id,
            floor_id: selectedFloor
          });
          setRooms(prev => ({
            ...prev,
            [selectedFloor]: response.data
          }));
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      }
    };
    fetchRooms();
  }, [selectedFloor, id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Building not found</div>
      </div>
    );
  }

  const currentRooms = rooms[selectedFloor] || [];
  const roomTypes = {
    'Lab': { color: 'bg-blue-100 text-blue-800', icon: '🧪' },
    'Classroom': { color: 'bg-green-100 text-green-800', icon: '📚' },
    'Office': { color: 'bg-purple-100 text-purple-800', icon: '🏢' },
    'Faculty Cabin': { color: 'bg-yellow-100 text-yellow-800', icon: '👤' },
    'Washroom': { color: 'bg-gray-100 text-gray-800', icon: '🚻' },
    'Emergency Exit': { color: 'bg-red-100 text-red-800', icon: '🚪' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Building Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{building.name}</h1>
        {building.description && (
          <p className="text-gray-600 mb-4">{building.description}</p>
        )}
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-5 w-5" />
          <span>Lat: {building.latitude}, Lng: {building.longitude}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Floors Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Layers className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-bold">Floors</h2>
            </div>
            <div className="space-y-2">
              {floors.map(floor => (
                <button
                  key={floor._id}
                  onClick={() => setSelectedFloor(floor._id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedFloor === floor._id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {floor.floor_name || `Floor ${floor.floor_number}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Rooms</h2>
            {currentRooms.length === 0 ? (
              <p className="text-gray-600">No rooms found on this floor.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentRooms.map(room => {
                  const roomType = roomTypes[room.type] || { color: 'bg-gray-100 text-gray-800', icon: '📍' };
                  return (
                    <Link
                      key={room._id}
                      to={`/room/${room._id}`}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{room.room_no}</h3>
                        <span className="text-2xl">{roomType.icon}</span>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${roomType.color}`}>
                        {room.type}
                      </span>
                      {room.capacity > 0 && (
                        <p className="text-sm text-gray-600 mt-2">Capacity: {room.capacity}</p>
                      )}
                      {room.description && (
                        <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingPage;

