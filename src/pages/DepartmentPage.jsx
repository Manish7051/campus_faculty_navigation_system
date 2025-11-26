import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Users, FlaskConical, GraduationCap } from 'lucide-react';
import { getDepartment } from '../services/api';

const DepartmentPage = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await getDepartment(id);
        setDepartment(response.data);
      } catch (error) {
        console.error('Error fetching department:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (!department) return <div className="text-center">Department not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{department.name}</h1>

        {department?.overview && <p className="text-gray-600 mb-4">{department.overview}</p>}
        {department?.description && <p className="text-gray-600">{department.description}</p>}

        {/* Location Info */}
        {department?.building_id && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-semibold">{department.building_id?.name}</p>

                {department?.floor_id && (
                  <p className="text-sm text-gray-600">
                    {department.floor_id?.floor_name ||
                      `Floor ${department.floor_id?.floor_number}`}
                  </p>
                )}
              </div>
            </div>

            <Link
              to={`/building/${department.building_id?._id}`}
              className="mt-2 inline-block text-primary-600 hover:underline"
            >
              View Building Details →
            </Link>
          </div>
        )}
      </div>

      {/* Labs */}
      {department?.labs?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <FlaskConical className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold">Labs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {department.labs.map((lab) => (
              <Link
                key={lab?._id}
                to={`/room/${lab?._id}`}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold">{lab?.room_no}</h3>
                <p className="text-sm text-gray-600">{lab?.description || 'Lab'}</p>
                {lab?.capacity && (
                  <p className="text-sm text-gray-500">Capacity: {lab.capacity}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Classrooms */}
      {department?.classrooms?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold">Classrooms</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {department.classrooms.map((room) => (
              <Link
                key={room?._id}
                to={`/room/${room?._id}`}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold">{room?.room_no}</h3>
                <p className="text-sm text-gray-600">{room?.description || 'Classroom'}</p>
                {room?.capacity && (
                  <p className="text-sm text-gray-500">Capacity: {room.capacity}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Faculty */}
      {department?.faculty?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold">Faculty</h2>


          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {department.faculty.map((member) => (
              <Link
                key={member?._id}
                to={`/faculty`}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold">{member?.name}</h3>
                <p className="text-sm text-gray-600">{member?.designation}</p>

                {member?.room_id && (
                  <p className="text-sm text-primary-600">
                    Room {member.room_id?.room_no}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentPage;
