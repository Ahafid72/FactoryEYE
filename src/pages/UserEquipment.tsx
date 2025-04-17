import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { Trash2 } from 'lucide-react';

interface EquipmentData {
  time: string;
  pressure: number;
  current: number;
  vibrationX: number;
  vibrationY: number;
  vibrationZ: number;
  vibrationMean?: number;
}

interface Zone {
  id: number;
  name: string;
  equipment: string[];
}

const UserEquipment: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([
    { id: 1, name: 'Zone A - Production', equipment: ['Compresseur C-201'] },
    { id: 2, name: 'Zone B - Assemblage', equipment: ['Pompe P-101'] },
  ]);

  const [data, setData] = useState<EquipmentData[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  // Simulate real-time data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const vibrationX = +(Math.random() * 3).toFixed(2);
      const vibrationY = +(Math.random() * 3).toFixed(2);
      const vibrationZ = +(Math.random() * 3).toFixed(2);
      const vibrationMean = +((vibrationX + vibrationY + vibrationZ) / 3).toFixed(2);

      setData(prev => [
        ...prev.slice(-19),
        {
          time: formattedTime,
          pressure: +(Math.random() * 5 + 2).toFixed(2),
          current: +(Math.random() * 10 + 10).toFixed(2),
          vibrationX,
          vibrationY,
          vibrationZ,
          vibrationMean
        }
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteEquipment = (zoneId: number, eq: string) => {
    const updated = zones.map(zone =>
      zone.id === zoneId
        ? { ...zone, equipment: zone.equipment.filter(e => e !== eq) }
        : zone
    );
    setZones(updated);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Équipements par Zone</h1>
      </div>

      <div className="grid gap-6">
        {zones.map(zone => (
          <div key={zone.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">{zone.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              {zone.equipment.map((eq, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center px-4 py-2 rounded-lg cursor-pointer transition ${
                    selectedEquipment === eq ? 'bg-blue-100' : 'bg-gray-50'
                  }`}
                  onClick={() => setSelectedEquipment(eq)}
                >
                  <span>{eq}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEquipment(zone.id, eq);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedEquipment && (
        <div className="space-y-6 mt-6">
          <h2 className="text-xl font-bold">Mesures en temps réel - {selectedEquipment}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Pression (bar)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pressure" stroke="#dc2626" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Courant (A)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="current" stroke="#16a34a" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Vibrations (mm/s)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="vibrationX" stroke="#2563eb" name="Vibration X" />
                <Line type="monotone" dataKey="vibrationY" stroke="#10b981" name="Vibration Y" />
                <Line type="monotone" dataKey="vibrationZ" stroke="#f59e0b" name="Vibration Z" />
                <Line type="monotone" dataKey="vibrationMean" stroke="#6b7280" strokeDasharray="5 5" name="Vibration Moyenne" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEquipment;