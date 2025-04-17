import React, { useState } from 'react';
import { Folder, Trash, PlusCircle, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
 
const initialProjects = [
  {
    id: 1,
    name: 'Atelier Jorf Lasfar',
    expanded: true,
    equipment: [
      {
        id: 1,
        name: 'Compresseur A',
        tag: 'TAG-001',
        expanded: false,
        sensors: [
          { id: 1, name: 'Courant', qty: 2 },
          { id: 2, name: 'Vibration', qty: 1 },
          { id: 3, name: 'Pression', qty: 1 },
        ],
      },
    ],
  },
];
 
export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    equipment: [{ name: '', tag: '', sensors: [{ name: '', qty: 1 }] }],
  });
  const [editing, setEditing] = useState(null);
 
  const toggleProject = (projectId: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, expanded: !p.expanded } : p))
    );
  };
 
  const toggleEquipment = (projectId: number, equipmentId: number) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          equipment: project.equipment.map((eq) =>
            eq.id === equipmentId ? { ...eq, expanded: !eq.expanded } : eq
          ),
        };
      })
    );
  };
 
  const handleAddProject = () => {
    const id = Date.now();
    setProjects((prev) => [
      ...prev,
      {
        id,
        name: newProject.name,
        expanded: true,
        equipment: newProject.equipment.map((e, i) => ({
          id: i + 1,
          ...e,
          expanded: false,
          sensors: e.sensors.map((s, j) => ({ id: j + 1, ...s })),
        })),
      },
    ]);
    setShowModal(false);
    setNewProject({ name: '', equipment: [{ name: '', tag: '', sensors: [{ name: '', qty: 1 }] }] });
  };
 
  const handleDeleteProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };
 
  const handleSensorEdit = (projectId: number, equipmentId: number, sensorId: number, key: string, value: string | number) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          equipment: project.equipment.map((eq) => {
            if (eq.id !== equipmentId) return eq;
            return {
              ...eq,
              sensors: eq.sensors.map((s) =>
                s.id === sensorId ? { ...s, [key]: value } : s
              ),
            };
          }),
        };
      })
    );
  };
 
  const handleEquipmentEdit = (projectId: number, equipmentId: number, key: any, value: any) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          equipment: project.equipment.map((eq) =>
            eq.id === equipmentId ? { ...eq, [key]: value } : eq
          ),
        };
      })
    );
  };
 
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" /> Ajouter un projet
        </button>
      </div>
 
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <button
                onClick={() => toggleProject(project.id)}
                className="font-semibold text-lg flex items-center gap-2"
              >
                {project.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Folder className="w-5 h-5 text-blue-500" /> {project.name}
              </button>
              <button
                onClick={() => handleDeleteProject(project.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
 
            {project.expanded && (
              <ul className="mt-2 ml-6 space-y-2">
                {project.equipment.map((e) => (
                  <li key={e.id}>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => toggleEquipment(project.id, e.id)}
                        className="font-medium text-gray-700 flex items-center gap-2"
                      >
                        {e.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        - {e.name} ({e.tag})
                      </button>
                      <button className="text-blue-500 hover:underline text-xs">Voir rapport</button>
                    </div>
                    {e.expanded && (
                      <ul className="ml-8 text-sm text-gray-600">
                        {e.sensors.map((s) => (
                          <li key={s.id} className="flex items-center gap-2">
                            <input
                              className="border rounded p-1 w-40"
                              value={s.name}
                              onChange={(event) => handleSensorEdit(project.id, e.id, s.id, 'name', event.target.value)}
                            />
                            <input
                              type="number"
                              className="border rounded p-1 w-16"
                              value={s.qty}
                              onChange={(event) => handleSensorEdit(project.id, e.id, s.id, 'qty', +event.target.value)}
                            />
                          </li>
                        ))}
                        <li className="text-xs text-green-600 cursor-pointer">+ Ajouter un capteur</li>
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
 
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[500px] space-y-4">
            <h2 className="text-xl font-semibold mb-4">Nouveau projet</h2>
            <input
              type="text"
              placeholder="Nom du projet"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full border p-2 rounded"
            />
            {newProject.equipment.map((eq, idx) => (
              <div key={idx} className="space-y-2">
                <input
                  type="text"
                  placeholder="Nom de l'équipement"
                  value={eq.name}
                  onChange={(e) => {
                    const updated = [...newProject.equipment];
                    updated[idx].name = e.target.value;
                    setNewProject({ ...newProject, equipment: updated });
                  }}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Tag"
                  value={eq.tag}
                  onChange={(e) => {
                    const updated = [...newProject.equipment];
                    updated[idx].tag = e.target.value;
                    setNewProject({ ...newProject, equipment: updated });
                  }}
                  className="w-full border p-2 rounded"
                />
                {eq.sensors.map((sensor, sIdx) => (
                  <div key={sIdx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type de capteur"
                      value={sensor.name}
                      onChange={(e) => {
                        const updated = [...newProject.equipment];
                        updated[idx].sensors[sIdx].name = e.target.value;
                        setNewProject({ ...newProject, equipment: updated });
                      }}
                      className="flex-1 border p-2 rounded"
                    />
                    <input
                      type="number"
                      value={sensor.qty}
                      onChange={(e) => {
                        const updated = [...newProject.equipment];
                        updated[idx].sensors[sIdx].qty = +e.target.value;
                        setNewProject({ ...newProject, equipment: updated });
                      }}
                      className="w-16 border p-2 rounded"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updated = [...newProject.equipment];
                    updated[idx].sensors.push({ name: '', qty: 1 });
                    setNewProject({ ...newProject, equipment: updated });
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Ajouter un capteur
                </button>
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleAddProject()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:underline"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 