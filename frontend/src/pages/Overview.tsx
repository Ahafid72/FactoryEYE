import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Power, 
  PowerOff,
  Bell,
  BarChart,
  CheckCircle,
  XCircle,
  Users,
  Settings,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Equipment {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  type: string;
}

interface AlertSummary {
  critical: number;
  major: number;
  minor: number;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  lastSeen: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

function Overview() {

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      navigate('/unauthorized');
    }
  }, [navigate]);
  
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    firstname: '', 
    lastname: '', 
    role: 'USER' 
  });
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [alerts, setAlerts] = useState<AlertSummary>({ critical: 0, major: 0, minor: 0 });
  const [totalEquipment, setTotalEquipment] = useState<number>(0);
  const [loading, setLoading] = useState({
    equipment: true,
    alerts: true,
    total: true
  });
  const [error, setError] = useState<string | null>(null);

  const mockUsers: User[] = [
    { id: '1', name: 'Mohamed Hayyan', avatar: '', lastSeen: new Date().toISOString() },
    { id: '2', name: 'Loubna chalkhane', avatar: '', lastSeen: new Date().toISOString() },
    { id: '3', name: 'Anas hafid', avatar: '', lastSeen: new Date().toISOString() },
  ];
   
  

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ ...loading, equipment: true });
    try {
      const response = await fetch('http://localhost:8080/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to register user');
      setMessage('User registered successfully!');
      setIsSuccess(true);
      setFormData({ 
        username: '', 
        email: '', 
        password: '', 
        firstname: '', 
        lastname: '', 
        role: 'USER' 
      });
      setShowModal(false);
    } catch (error) {
      console.error(error);
      setMessage('Error registering user');
      setIsSuccess(false);
    } finally {
      setLoading({ ...loading, equipment: false });
      setShowMessageModal(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total equipment
        const totalRes = await fetch('http://localhost:8080/api/equipments/total');
        if (!totalRes.ok) throw new Error('Failed to fetch total equipment');
        setTotalEquipment(await totalRes.json());

        // Fetch all equipment
        const equipmentRes = await fetch('http://localhost:8080/api/equipments');
        if (!equipmentRes.ok) throw new Error('Failed to fetch equipment');
        setEquipment(await equipmentRes.json());

        // Fetch alerts
        

        setLoading({ equipment: false, alerts: false, total: false });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading({ equipment: false, alerts: false, total: false });
      }
    };

    fetchData();
  }, []);

  const activeEquipment = equipment.filter(eq => eq.status === 'active').length;
  const inactiveEquipment = equipment.length - activeEquipment;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-lg p-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold text-gray-800 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Activity className="text-blue-600" />
            Industrial Monitoring Dashboard
          </motion.h1>
          <div className="flex items-center gap-6">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="text-gray-600" />
              <span className="font-medium">{mockUsers.length} Users Online</span>
            </motion.div>
            <motion.button
              className="p-2 rounded-full hover:bg-gray-100"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Settings className="text-gray-600" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Equipment */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Total Equipment</h3>
              <Activity className={`text-blue-600 ${loading.total ? 'animate-pulse' : ''}`} />
            </div>
            <p className="text-3xl font-bold mt-2">
              {loading.total ? '...' : totalEquipment}
            </p>
          </motion.div>

          {/* Equipment Status */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Equipment Status</h3>
              <div className="flex gap-2">
                <Power className="text-green-600" />
                <PowerOff className="text-red-600" />
              </div>
            </div>
            <div className="flex gap-4 mt-2 items-center">
              <p className="text-3xl font-bold text-green-600">
                {loading.equipment ? '...' : activeEquipment}
              </p>
              <span className="text-gray-400">/</span>
              <p className="text-3xl font-bold text-red-600">
                {loading.equipment ? '...' : inactiveEquipment}
              </p>
            </div>
          </motion.div>

          {/* Alerts */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Current Alerts</h3>
              <Bell className={`text-yellow-600 ${loading.alerts ? 'animate-pulse' : ''}`} />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-red-600">Critical</span>
                <span className="font-bold">
                  {loading.alerts ? '...' : alerts.critical}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600">Major</span>
                <span className="font-bold">
                  {loading.alerts ? '...' : alerts.major}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Minor</span>
                <span className="font-bold">
                  {loading.alerts ? '...' : alerts.minor}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Production Status */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Production Status</h3>
              <BarChart className="text-blue-600" />
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex justify-between text-sm text-blue-600 font-semibold">
                  <span>Progress</span>
                  <span>
                    {loading.total || loading.equipment 
                      ? '...' 
                      : `${Math.round((activeEquipment / totalEquipment) * 100)}%`}
                  </span>
                </div>
                <div className="w-full bg-blue-200 h-2 rounded mt-1">
                  <motion.div
                    className="bg-blue-500 h-2 rounded"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: loading.total || loading.equipment 
                        ? '100%' 
                        : `${(activeEquipment / totalEquipment) * 100}%` 
                    }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Equipment Overview */}
        <motion.div
          className="bg-white rounded-xl shadow p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-4">Equipment Overview</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2 text-left">ID</th>
                <th className="border border-gray-200 p-2 text-left">Name</th>
                <th className="border border-gray-200 p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((eq) => (
                <tr key={eq.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-2">{eq.id}</td>
                  <td className="border border-gray-200 p-2">{eq.name}</td>
                  <td className="border border-gray-200 p-2">
                    <span
                      className={`flex items-center gap-2 px-2 py-1 rounded text-white ${
                        eq.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {eq.status === 'active' ? 
                        <CheckCircle className="w-4 h-4" /> : 
                        <XCircle className="w-4 h-4" />}
                      {eq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Connected Users */}
       
        {/* Connected Users */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow p-6 mt-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Connected Users</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </motion.div>

        {/* Modal for Adding User */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Register New User</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <label className={`p-3 border rounded-lg cursor-pointer ${
                    formData.role === 'USER' ? 'bg-blue-100 border-blue-500' : ''
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="USER"
                      checked={formData.role === 'USER'}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className="font-medium">User</span>
                  </label>
                  <label className={`p-3 border rounded-lg cursor-pointer ${
                    formData.role === 'ADMIN' ? 'bg-blue-100 border-blue-500' : ''
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="ADMIN"
                      checked={formData.role === 'ADMIN'}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className="font-medium">Admin</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={loading.equipment}
                  >
                    {loading.equipment ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success/Error Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`bg-white rounded-lg p-6 w-full max-w-sm text-center ${
                isSuccess ? 'border-green-500' : 'border-red-500'
              } border-2`}
            >
              <div className="flex justify-center mb-4">
                {isSuccess ? (
                  <CheckCircle className="w-12 h-12 text-green-500" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-500" />
                )}
              </div>
              <p className="text-lg font-medium">{message}</p>
              <button
                onClick={() => setShowMessageModal(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Overview;