import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Search, X } from 'lucide-react';
import FilterPanel from '../components/FilterPanel';
import { getFaculty } from '../services/api';

const FacultyDirectory = () => {
  const [faculty, setFaculty] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const params = {
          ...filters,
          search: searchQuery.trim() || undefined
        };
        // Remove empty values
        Object.keys(params).forEach(key => {
          if (params[key] === undefined || params[key] === '') {
            delete params[key];
          }
        });
        const response = await getFaculty(params);
        setFaculty(response.data);
      } catch (error) {
        console.error('Error fetching faculty:', error);
        setFaculty([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchFaculty();
    }, searchQuery ? 300 : 0);
    
    return () => clearTimeout(timeoutId);
  }, [filters, searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Faculty Directory</h1>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search faculty by name or room number..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          <FilterPanel onFilterChange={handleFilterChange} filters={filters} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Searching...</p>
        </div>
      ) : faculty.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No faculty members found matching your criteria.</p>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Try searching by name, room number, building, or department
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map(member => (
            <div
              key={member._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary-600">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-gray-600">{member.designation}</p>
                  {member.department && (
                    <p className="text-sm text-primary-600">{member.department.name}</p>
                  )}
                </div>
              </div>

              {member.room_id && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span>
                      {member.room_id.building_id?.name} - {member.room_id.floor_id?.floor_name || `Floor ${member.room_id.floor_id?.floor_number}`} - Room {member.room_id.room_no}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {member.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <a href={`mailto:${member.email}`} className="text-primary-600 hover:underline">
                      {member.email}
                    </a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <a href={`tel:${member.phone}`} className="text-primary-600 hover:underline">
                      {member.phone}
                    </a>
                  </div>
                )}
                {member.office_hours && (
                  <div className="text-sm text-gray-600">
                    Office Hours: {member.office_hours}
                  </div>
                )}
              </div>

              {member.room_id && (
                <Link
                  to={`/room/${member.room_id._id}`}
                  className="block w-full text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Get Directions
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyDirectory;

