import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Settings } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Brush
} from 'recharts';

interface EquipmentData {
  timestamp?: string;
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

// Mock data for when API is not available
const mockZones: Zone[] = [
  {
    id: 1,
    name: 'Zone Production',
    equipment: ['Compresseur 1', 'Pompe A']
  },
  {
    id: 2,
    name: 'Zone Maintenance',
    equipment: ['Compresseur 2', 'Ventilateur B']
  }
];

// Mock equipment data
const generateMockData = (): EquipmentData[] => {
  const mockData: EquipmentData[] = [];
  const now = new Date();

  for (let i = 0; i < 100; i++) {
    const time = new Date(now.getTime() - (99 - i) * 20000); // 20s intervals
    mockData.push({
      time: time.toLocaleTimeString(),
      pressure: 5 + Math.random() * 2,
      current: 10 + Math.random() * 5,
      vibrationX: 0.5 + Math.random() * 1.5,
      vibrationY: 0.4 + Math.random() * 1.2,
      vibrationZ: 0.6 + Math.random() * 1.8,
      vibrationMean: 0 // Will be calculated
    });
  }

  // Calculate mean vibration
  mockData.forEach(item => {
    item.vibrationMean = +((item.vibrationX + item.vibrationY + item.vibrationZ) / 3).toFixed(2);
  });

  return mockData;
};

const PAGE_SIZE = 20;

const Equipment: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [data, setData] = useState<EquipmentData[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [expandedZoneId, setExpandedZoneId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState<number | null>(null);
  const [newZoneName, setNewZoneName] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [isLoadingZones, setIsLoadingZones] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [useBackend, setUseBackend] = useState(true);

  // Nouveaux états pour navigation et zoom
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2023-01-01'));
  const [selectedHour, setSelectedHour] = useState<string>('09:00:00');
  const [showSettings, setShowSettings] = useState(false);
  const [page, setPage] = useState(0);
  const [zoomRange, setZoomRange] = useState<[number, number] | null>(null);

  // Fetch zones
  const fetchZones = async () => {
    setIsLoadingZones(true);
    try {
      const API_URL = 'http://localhost:8080/api/zones';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(API_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      const json = await res.json();
      const safeZones = json.map((zone: any) => ({
        id: zone.id_zone || zone.id,
        name: zone.zoneName,
        equipment: zone.equipment?.map((eq: any) => eq.name) || []
      }));
      setZones(safeZones.reverse());
      setUseBackend(true);
    } catch (err) {
      setZones(mockZones);
      setUseBackend(false);
    } finally {
      setIsLoadingZones(false);
    }
  };

  // Fetch compressor data
  const fetchCompressorData = async () => {
    setIsLoadingData(true);
    try {
      if (!useBackend) throw new Error('Using mock data mode');
      const API_URL = 'http://localhost:8080/api/compresseur/data';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(API_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      const backendData = await response.json();
      backendData.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const transformedData = backendData.map((item: any) => ({
        timestamp: item.timestamp,
        time: new Date(item.timestamp).toLocaleTimeString(),
        pressure: item.pressure,
        current: item.currentValue,
        vibrationX: item.vibrationX,
        vibrationY: item.vibrationY,
        vibrationZ: item.vibrationZ,
        vibrationMean: +((item.vibrationX + item.vibrationY + item.vibrationZ) / 3).toFixed(2)
      }));
      setData(transformedData);
    } catch (error) {
      setData(generateMockData());
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchZones();
    fetchCompressorData();
    const interval = setInterval(fetchCompressorData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Données filtrées pour l'affichage (date sélectionnée + à partir de l'heure choisie, un point toutes les 20s)
  const filteredData = React.useMemo(() => {
    if (!selectedEquipment) return [];
    const selectedDay = selectedDate.toISOString().slice(0, 10);
    const filtered = data.filter(d => {
      if (!d.timestamp) return false;
      const itemDay = new Date(d.timestamp!).toISOString().slice(0, 10);
      return itemDay === selectedDay && d.time >= selectedHour;
    });
    let lastTimestamp: number | null = null;
    return filtered.filter(d => {
      const [h, m, s] = d.time.split(':').map(Number);
      const currentSec = h * 3600 + m * 60 + s;
      if (lastTimestamp === null || currentSec - lastTimestamp >= 20) {
        lastTimestamp = currentSec;
        return true;
      }
      return false;
    });
  }, [data, selectedEquipment, selectedDate, selectedHour]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

  const paginatedData = React.useMemo(() => {
    if (!selectedEquipment) return [];
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    let pageData = filteredData.slice(start, end);
    // Appliquer le zoom basic si défini
    if (zoomRange && pageData.length > 0) {
      const [zoomStart, zoomEnd] = zoomRange;
      pageData = pageData.slice(zoomStart, zoomEnd + 1);
    }
    return pageData;
  }, [filteredData, selectedEquipment, page, zoomRange]);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  // Reset page and zoom when equipment, date or hour changes
  useEffect(() => {
    setPage(0);
    setZoomRange(null);
  }, [selectedEquipment, totalPages, selectedDate, selectedHour]);

  // Gestion du curseur de zoom (slider)
  const handleZoomSlider = (e: React.ChangeEvent<HTMLInputElement>, bound: 'start' | 'end') => {
    if (!paginatedData.length) return;
    let [start, end] = zoomRange ?? [0, paginatedData.length - 1];
    if (bound === 'start') {
      start = Math.min(Number(e.target.value), end - 1);
    } else {
      end = Math.max(Number(e.target.value), start + 1);
    }
    setZoomRange([start, end]);
  };

  // Réinitialiser le zoom
  const resetZoom = () => setZoomRange(null);

  // Générer les options d'heure pour la recherche rapide (toutes les 5 minutes)
  const hourOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      hourOptions.push(`${hh}:${mm}:00`);
    }
  }

  const handleSubmitZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) {
      alert('Le nom de la zone est obligatoire');
      return;
    }
    try {
      if (!useBackend) {
        setZones(prev => [
          {
            id: Math.max(...prev.map(z => z.id), 0) + 1,
            name: newZoneName,
            equipment: newEquipment ? [newEquipment] : []
          },
          ...prev
        ]);
        setShowModal(false);
        setNewZoneName('');
        setNewEquipment('');
        return;
      }
      const response = await fetch('http://localhost:8080/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneName: newZoneName,
          description: "Description par défaut",
          location: "Localisation par défaut",
          equipment: [newEquipment]
        }),
      });
      if (!response.ok) throw new Error('Erreur lors de l\'ajout');
      await fetchZones();
      setShowModal(false);
      setNewZoneName('');
      setNewEquipment('');
    } catch (error) {
      alert('Erreur lors de la création');
    }
  };

  const handleDeleteEquipment = async (zoneId: number, eq: string) => {
    try {
      if (!useBackend) {
        setZones(prev =>
          prev.map(zone => zone.id === zoneId ?
            { ...zone, equipment: zone.equipment.filter(e => e !== eq) } :
            zone
          )
        );
        if (selectedEquipment === eq) setSelectedEquipment(null);
        return;
      }
      const response = await fetch(
        `http://localhost:8080/api/zones/${zoneId}/equipment/${encodeURIComponent(eq)}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Erreur de suppression');
      await fetchZones();
      if (selectedEquipment === eq) setSelectedEquipment(null);
    } catch (error) {
      alert('Erreur de suppression');
    }
  };

  const handleDeleteZone = async () => {
    if (!zoneToDelete) return;
    try {
      if (!useBackend) {
        setZones(prev => prev.filter(zone => zone.id !== zoneToDelete));
        setShowDeleteModal(false);
        return;
      }
      const response = await fetch(`http://localhost:8080/api/zones/${zoneToDelete}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erreur de suppression');
      await fetchZones();
      setShowDeleteModal(false);
    } catch (error) {
      alert('Erreur de suppression');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Équipements</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Ajouter une zone
          </button>
        </div>
      </div>

      {/* Navigation date et heure */}
      <div className="flex items-center gap-2 mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => date && setSelectedDate(date)}
          className="p-2 border rounded-lg"
          dateFormat="dd/MM/yyyy"
        />
        <select
          value={selectedHour}
          onChange={e => setSelectedHour(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {hourOptions.map(opt => (
            <option key={opt} value={opt}>{opt.slice(0, 5)}</option>
          ))}
        </select>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Zones List */}
      {isLoadingZones ? (
        <div className="text-center py-8">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p>Chargement des zones...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {zones.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500 mb-4">Aucune zone trouvée</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Ajouter une zone
              </button>
            </div>
          ) : (
            zones.map(zone => (
              <div key={zone.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div
                  className="flex justify-between items-center cursor-pointer mb-4 group"
                  onClick={() => setExpandedZoneId(expandedZoneId === zone.id ? null : zone.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`transform transition-transform ${expandedZoneId === zone.id ? 'rotate-90' : ''}`}>
                      ➤
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">{zone.name}</h2>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoneToDelete(zone.id);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Equipment List */}
                {expandedZoneId === zone.id && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {zone.equipment.length === 0 ? (
                        <div className="col-span-2 text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">Aucun équipement trouvé dans cette zone</p>
                        </div>
                      ) : (
                        zone.equipment.map((eq, i) => (
                          <div
                            key={i}
                            className={`flex justify-between items-center px-4 py-3 rounded-lg cursor-pointer transition-all ${
                              selectedEquipment === eq
                                ? 'bg-blue-100 border-2 border-blue-300'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                            onClick={() => setSelectedEquipment(eq === selectedEquipment ? null : eq)}
                          >
                            <span className="font-medium text-gray-700">{eq}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEquipment(zone.id, eq);
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Charts */}
                    {selectedEquipment && (
                      <div className="space-y-6 mt-6">
                        {/* Navigation temporelle améliorée */}
                        <div className="flex justify-end gap-2 mb-2 items-center">
                          <button
                            onClick={handlePrev}
                            disabled={page === 0}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                          >
                            &larr; Précédent
                          </button>
                          <span className="text-gray-600">
                            Page {page + 1} / {totalPages}
                          </span>
                          <button
                            onClick={handleNext}
                            disabled={page >= totalPages - 1}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                          >
                            Suivant &rarr;
                          </button>
                        </div>

                        {/* Curseur de zoom basic */}
                        {paginatedData.length > 2 && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs text-gray-500">Zoom basic :</span>
                            <input
                              type="range"
                              min={0}
                              max={paginatedData.length - 2}
                              value={zoomRange ? zoomRange[0] : 0}
                              onChange={e => handleZoomSlider(e, 'start')}
                              className="w-32"
                            />
                            <input
                              type="range"
                              min={1}
                              max={paginatedData.length - 1}
                              value={zoomRange ? zoomRange[1] : paginatedData.length - 1}
                              onChange={e => handleZoomSlider(e, 'end')}
                              className="w-32"
                            />
                            <button
                              onClick={resetZoom}
                              className="ml-2 px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
                              disabled={!zoomRange}
                            >
                              Réinitialiser le zoom
                            </button>
                          </div>
                        )}

                        {/* Pression */}
                        <div className="bg-white p-6 rounded-xl shadow-xl">
                          <h3 className="text-xl font-semibold mb-4">Pression (bar)</h3>
                          <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={paginatedData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="pressure"
                                  stroke="#dc2626"
                                  strokeWidth={2}
                                  dot={false}
                                />
                                {/* Zoom professionnel : Brush */}
                                <Brush dataKey="time" height={30} stroke="#8884d8" />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Courant */}
                        <div className="bg-white p-6 rounded-xl shadow-xl">
                          <h3 className="text-xl font-semibold mb-4">Courant (A)</h3>
                          <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={paginatedData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="current"
                                  stroke="#16a34a"
                                  strokeWidth={2}
                                  dot={false}
                                />
                                {/* Zoom professionnel : Brush */}
                                <Brush dataKey="time" height={30} stroke="#8884d8" />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Vibrations */}
                        <div className="bg-white p-6 rounded-xl shadow-xl">
                          <h3 className="text-xl font-semibold mb-4">Vibrations (mm/s)</h3>
                          <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={paginatedData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="vibrationX"
                                  stroke="#2563eb"
                                  strokeWidth={2}
                                  name="Vibration X"
                                  dot={false}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="vibrationY"
                                  stroke="#10b981"
                                  strokeWidth={2}
                                  name="Vibration Y"
                                  dot={false}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="vibrationZ"
                                  stroke="#f59e0b"
                                  strokeWidth={2}
                                  name="Vibration Z"
                                  dot={false}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="vibrationMean"
                                  stroke="#6b7280"
                                  strokeDasharray="5 5"
                                  strokeWidth={2}
                                  name="Moyenne"
                                  dot={false}
                                />
                                {/* Zoom professionnel : Brush */}
                                <Brush dataKey="time" height={30} stroke="#8884d8" />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-pop-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Nouvelle Zone</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmitZone} className="space-y-4">
              <input
                type="text"
                required
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de la zone"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
              />
              <input
                type="text"
                required
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de l'équipement"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-pop-in">
            <div className="flex flex-col items-center text-center">
              <Trash2 className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Confirmer la suppression</h2>
              <p className="text-gray-600 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteZone}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;