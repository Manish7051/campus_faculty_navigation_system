import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { getBuildings, getDepartments } from '../services/api';

const FilterPanel = ({ onFilterChange, filters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingsRes, deptsRes] = await Promise.all([
          getBuildings(),
          getDepartments()
        ]);
        setBuildings(buildingsRes.data);
        setDepartments(deptsRes.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const cleared = {};
    setLocalFilters(cleared);
    if (onFilterChange) {
      onFilterChange(cleared);
    }
  };

  const categories = ['Faculty', 'Classroom', 'Lab', 'Department', 'Facility', 'Office'];
  const floors = ['Ground', 'First', 'Second', 'Third'];
  const designations = ['HOD', 'Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <Filter className="h-5 w-5" />
        <span>Filters</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={localFilters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Building Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Building</label>
              <select
                value={localFilters.building || ''}
                onChange={(e) => handleFilterChange('building', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Buildings</option>
                {buildings.map(building => (
                  <option key={building._id} value={building._id}>{building.name}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <select
                value={localFilters.department || ''}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Floor Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Floor</label>
              <select
                value={localFilters.floor || ''}
                onChange={(e) => handleFilterChange('floor', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Floors</option>
                {floors.map(floor => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
              </select>
            </div>

            {/* Designation Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Designation</label>
              <select
                value={localFilters.designation || ''}
                onChange={(e) => handleFilterChange('designation', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Designations</option>
                {designations.map(des => (
                  <option key={des} value={des}>{des}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

