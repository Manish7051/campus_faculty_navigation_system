import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Filter } from 'lucide-react';
import { getFacilities } from '../services/api';
import FilterPanel from '../components/FilterPanel';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await getFacilities(filters);
        setFacilities(response.data);
        setFilteredFacilities(response.data);
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };
    fetchFacilities();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const facilityIcons = {
    'Library': '📚',
    'Canteen': '🍽️',
    'Parking': '🅿️',
    'Hostel': '🏠',
    'Admin Block': '🏢',
    'Auditorium': '🎭',
    'Sports Area': '⚽',
    'Security': '🛡️',
    'ATM': '🏦',
    'Medical Room': '🏥',
  };

  // Group facilities by type
  const groupedFacilities = filteredFacilities.reduce((acc, facility) => {
    if (!acc[facility.type]) {
      acc[facility.type] = [];
    }
    acc[facility.type].push(facility);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Campus Facilities</h1>
        <div className="flex justify-end">
          <FilterPanel onFilterChange={handleFilterChange} filters={filters} />
        </div>
      </div>

      {Object.keys(groupedFacilities).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No facilities found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFacilities).map(([type, facilitiesList]) => (
            <div key={type} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <span className="text-3xl">{facilityIcons[type] || '📍'}</span>
                <span>{type}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facilitiesList.map(facility => (
                  <div
                    key={facility._id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-lg mb-2">{facility.name}</h3>
                    
                    {facility.building_id && (
                      <div className="mb-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>{facility.building_id.name}</span>
                        </div>
                        {facility.floor_id && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 ml-6">
                            <span>Floor: {facility.floor_id.floor_name || facility.floor_id.floor_number}</span>
                          </div>
                        )}
                        {facility.room_id && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 ml-6">
                            <span>Room: {facility.room_id.room_no}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {facility.description && (
                      <p className="text-sm text-gray-600 mb-2">{facility.description}</p>
                    )}

                    {facility.operating_hours && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Hours:</span> {facility.operating_hours}
                      </p>
                    )}

                    {facility.building_id && (
                      <Link
                        to={`/building/${facility.building_id._id}`}
                        className="inline-flex items-center space-x-2 text-primary-600 hover:underline text-sm"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Get Directions</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Facilities;

