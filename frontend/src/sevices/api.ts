export const fetchZones = async () => {
    const response = await fetch('http://localhost:8080/api/zones');
    if (!response.ok) throw new Error('Échec du chargement');
    return response.json();
  };
  
  export const createZone = async (zoneData: any) => {
    const response = await fetch('http://localhost:8080/api/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zoneData),
    });
    if (!response.ok) throw new Error('Échec de la création');
    return response.json();
  };
  
  export const deleteEquipment = async (zoneId: number, equipmentName: string) => {
    const response = await fetch(
      `http://localhost:8080/api/zones/${zoneId}/equipment/${encodeURIComponent(equipmentName)}`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error('Échec de la suppression');
  };