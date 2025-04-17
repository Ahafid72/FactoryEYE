import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  Power, 
  PowerOff,
  Bell,
  Settings,
  BarChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';


const mockEquipment = [
  { id: '1', name: 'Machine A1', status: 'active', location: { lat: 48.8566, lng: 2.3522 } },
  { id: '2', name: 'Machine B2', status: 'inactive', location: { lat: 48.8606, lng: 2.3376 } },
  { id: '3', name: 'Machine C3', status: 'active', location: { lat: 48.8529, lng: 2.3499 } },
];

const mockAlerts = {
  critical: 2,
  major: 3,
  minor: 5,
};

const mockUsers = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john', lastSeen: new Date().toISOString() },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=jane', lastSeen: new Date().toISOString() },
  { id: '3', name: 'Bob Wilson', avatar: 'https://i.pravatar.cc/150?u=bob', lastSeen: new Date().toISOString() },
];

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

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

function Overview() {
  const activeEquipment = mockEquipment.filter(eq => eq.status === 'active');

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
              <motion.div variants={pulseVariants} animate="pulse">
                <Activity className="text-blue-600" />
              </motion.div>
            </div>
            <p className="text-3xl font-bold mt-2">{mockEquipment.length}</p>
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
              <p className="text-3xl font-bold text-green-600">{activeEquipment.length}</p>
              <span className="text-gray-400">/</span>
              <p className="text-3xl font-bold text-red-600">{mockEquipment.length - activeEquipment.length}</p>
            </div>
          </motion.div>

          {/* Alerts */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Current Alerts</h3>
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                <Bell className="text-yellow-600" />
              </motion.div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-red-600">Critical</span>
                <span className="font-bold">{mockAlerts.critical}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600">Major</span>
                <span className="font-bold">{mockAlerts.major}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Minor</span>
                <span className="font-bold">{mockAlerts.minor}</span>
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
                  <span>{Math.round((activeEquipment.length / mockEquipment.length) * 100)}%</span>
                </div>
                <div className="w-full bg-blue-200 h-2 rounded mt-1">
                  <motion.div
                    className="bg-blue-500 h-2 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeEquipment.length / mockEquipment.length) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Map */}
        <motion.div
          className="bg-white rounded-xl shadow p-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-4">Equipment Location</h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {mockEquipment.map((eq) => (
                <Marker key={eq.id} position={[eq.location.lat, eq.location.lng]}>
                  <Popup>
                    <div>
                      <h3 className="font-bold">{eq.name}</h3>
                      <p>Status: {eq.status}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </motion.div>

        {/* Connected Users */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow p-6"
        >
          <h2 className="text-xl font-bold mb-4">Connected Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockUsers.map((user, index) => (
              <motion.div
                key={user.id}
                variants={itemVariants}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    Active since {new Date(user.lastSeen).toLocaleTimeString()}
                  </p>
                </div>
                <motion.div
                  className="ml-auto"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Overview;
