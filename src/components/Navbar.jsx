import { Link, useLocation } from 'react-router-dom';
import { MapPin, Users, Building2, Map, Home, Settings } from 'lucide-react';
import QRScanner from './QRScanner';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/map', label: 'Campus Map', icon: Map },
    { path: '/faculty', label: 'Faculty', icon: Users },
    { path: '/facilities', label: 'Facilities', icon: Building2 },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">Campus Nav</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="hidden md:block">
              <QRScanner />
            </div>
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

