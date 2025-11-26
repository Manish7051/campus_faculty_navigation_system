import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CampusMap from './pages/CampusMap';
import FacultyDirectory from './pages/FacultyDirectory';
import DepartmentPage from './pages/DepartmentPage';
import BuildingPage from './pages/BuildingPage';
import RoomDetails from './pages/RoomDetails';
import Facilities from './pages/Facilities';
import AdminPanel from './pages/AdminPanel';
// import SearchPage from './pages/SearchPage';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<CampusMap />} />
          <Route path="/faculty" element={<FacultyDirectory />} />
          <Route path="/department/:id" element={<DepartmentPage />} />
          <Route path="/building/:id" element={<BuildingPage />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* <Route path="/search" element={<SearchPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

