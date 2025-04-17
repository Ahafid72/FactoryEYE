import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  Bell, 
  LogOut,
  Factory,
  FileDown,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  // Fetch user data from localStorage
  const user = {
    name: localStorage.getItem('username') || "Utilisateur",
    role: localStorage.getItem('role') || "User",
    profilePicture: "https://tse3.mm.bing.net/th/id/OIP.GxwC7rumCfFT465ySJTfIwHaHa?rs=1&pid=ImgDetMain",
  };

  const menuItems = [
    { icon: LayoutDashboard, text: 'Vue d\'ensemble', path: '/' },
    { icon: FolderKanban, text: 'Projets', path: '/projects' },
    { icon: Factory, text: 'Équipements', path: '/equipment' },
    { icon: FileDown, text: 'Exporter', path: '/export' },
    { icon: Bell, text: 'Alertes', path: '/alerts' },
    { icon: Settings, text: 'Paramètres', path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          FactoryEYE
        </h1>
      </div>
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 border-l-4 border-blue-500' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-sm font-medium text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role === 'admin' ? 'Admin' : 'User'}</p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 text-slate-600 hover:text-red-600 w-full" 
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;