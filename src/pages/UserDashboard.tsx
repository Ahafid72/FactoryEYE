import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ThermometerSun,
  Trash2,
  UserCircle,
  Pencil,
  Gauge,
  Plus,
  MonitorCheck,
  Cpu,
  Thermometer,
  Waves,
  Battery
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Area,
  AreaChart
} from 'recharts';

const UserDashboard: React.FC = () => {
  const [sensors, setSensors] = useState([
    { id: 1, name: 'Motor Temperature Sensor', type: 'Temperature', status: 'Active', value: '75°C', health: 92 },
    { id: 2, name: 'Vibration Analyzer', type: 'Vibration', status: 'Warning', value: '2.8 mm/s', health: 78 },
    { id: 3, name: 'Pressure Monitor', type: 'Pressure', status: 'Active', value: '6.2 bar', health: 95 },
    { id: 4, name: 'Power Consumption', type: 'Power', status: 'Critical', value: '4.2 kW', health: 65 }
  ]);

  type DataPoint = {
    time: string;
    temperature: number;
    vibration: number;
    systemStatus: number;
  };

  const [sensorData, setSensorData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const baseTemp = 70 + Math.sin(now.getSeconds() / 10) * 5;
      const baseVibration = 2 + Math.cos(now.getSeconds() / 8) * 0.8;
      
      return {
        time: now.toLocaleTimeString(),
        temperature: baseTemp + (Math.random() * 2 - 1),
        vibration: Math.max(0, baseVibration + (Math.random() * 0.4 - 0.2)),
        systemStatus: 85 + Math.sin(now.getSeconds() / 15) * 10
      };
    };

    const interval = setInterval(() => {
      setSensorData(prev => [...prev.slice(-20), generateData()]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-500';
    if (health >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-bold">Industrial Equipment Monitoring</h1>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Online
          </span>
        </div>
      </motion.div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnimatePresence>
          {sensors.map((sensor, index) => (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${getStatusColor(sensor.status)} bg-opacity-20`}>
                  {sensor.type === 'Temperature' && <Thermometer className="w-6 h-6" />}
                  {sensor.type === 'Vibration' && <Waves className="w-6 h-6" />}
                  {sensor.type === 'Pressure' && <Gauge className="w-6 h-6" />}
                  {sensor.type === 'Power' && <Battery className="w-6 h-6" />}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.status)}`}>
                  {sensor.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{sensor.name}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600">Current Value</p>
                  <p className="text-2xl font-bold">{sensor.value}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Health</p>
                  <p className={`text-xl font-bold ${getHealthColor(sensor.health)}`}>{sensor.health}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Temperature Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Thermometer className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-semibold">Motor Temperature Monitoring</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sensorData}>
              <defs>
                <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[60, 90]} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="temperature" stroke="#ff7300" fill="url(#tempColor)" name="Temperature (°C)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Vibration Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Waves className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Vibration Analysis</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sensorData}>
              <defs>
                <linearGradient id="vibColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="vibration" stroke="#3b82f6" fill="url(#vibColor)" name="Vibration (mm/s)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* System Status Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-lg mb-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <MonitorCheck className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold">System Health Status</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="systemStatus" stroke="#10b981" name="System Health (%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default UserDashboard;