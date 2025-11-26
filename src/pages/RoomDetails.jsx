import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Building2, Layers, Navigation, ArrowLeft } from 'lucide-react';
import { getRoom } from '../services/api';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await getRoom(id);
        setRoom(response.data);
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [id]);

  const handleGetDirections = () => {
    if (room && room.building_id) {
      navigate('/map', {
        state: {
          destination: {
            lat: room.building_id.latitude,
            lng: room.building_id.longitude,
            name: `${room.building_id.name} - ${room.room_no}`
          }
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Room not found</div>
      </div>
    );
  }

  const roomTypeColors = {
    'Classroom': 'bg-green-100 text-green-800',
    'Lab': 'bg-blue-100 text-blue-800',
    'Office': 'bg-purple-100 text-purple-800',
    'Faculty Cabin': 'bg-yellow-100 text-yellow-800',
    'Hall': 'bg-indigo-100 text-indigo-800',
    'Washroom': 'bg-gray-100 text-gray-800',
    'Emergency Exit': 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Room {room.room_no}</h1>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              roomTypeColors[room.type] || 'bg-gray-100 text-gray-800'
            }`}>
              {room.type}
            </span>
          </div>
        </div>

        {/* Location Info */}
        <div className="space-y-4 mb-6">
          {room.building_id && (
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Building2 className="h-5 w-5 text-primary-600 mt-1" />
              <div>
                <p className="font-semibold">Building</p>
                <Link
                  to={`/building/${room.building_id._id}`}
                  className="text-primary-600 hover:underline"
                >
                  {room.building_id.name}
                </Link>
                {room.building_id.description && (
                  <p className="text-sm text-gray-600">{room.building_id.description}</p>
                )}
              </div>
            </div>
          )}

          {room.floor_id && (
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Layers className="h-5 w-5 text-primary-600 mt-1" />
              <div>
                <p className="font-semibold">Floor</p>
                <p className="text-gray-600">
                  {room.floor_id.floor_name || `Floor ${room.floor_id.floor_number}`}
                </p>
              </div>
            </div>
          )}

          {room.building_id && (
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-primary-600 mt-1" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-sm text-gray-600">
                  {room.building_id.latitude}, {room.building_id.longitude}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Room Details */}
        <div className="space-y-4 mb-6">
          {room.capacity > 0 && (
            <div>
              <p className="font-semibold mb-1">Capacity</p>
              <p className="text-gray-600">{room.capacity} seats</p>
            </div>
          )}

          {room.description && (
            <div>
              <p className="font-semibold mb-1">Description</p>
              <p className="text-gray-600">{room.description}</p>
            </div>
          )}

          {room.availability && (
            <div>
              <p className="font-semibold mb-1">Availability</p>
              <p className="text-gray-600">{room.availability}</p>
            </div>
          )}

          {room.coordinates && (room.coordinates.x || room.coordinates.y) && (
            <div>
              <p className="font-semibold mb-1">Coordinates on Floor Map</p>
              <p className="text-gray-600">X: {room.coordinates.x}, Y: {room.coordinates.y}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={handleGetDirections}
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Navigation className="h-5 w-5" />
            <span>Get Directions</span>
          </button>
          {room.building_id && (
            <Link
              to={`/building/${room.building_id._id}`}
              className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Building2 className="h-5 w-5" />
              <span>View Building</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

