package com.monprojet.factory.service;

import com.monprojet.factory.entity.Sensor;
import com.monprojet.factory.repository.SensorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SensorService {

    @Autowired
    private SensorRepository sensorRepository;

    // Récupérer tous les capteurs
    public List<Sensor> getAllSensors() {
        return sensorRepository.findAll();
    }

    // Récupérer un capteur par ID
    public Optional<Sensor> getSensorById(Long id) {
        return sensorRepository.findById(id);
    }

    // Récupérer les capteurs liés à un équipement
    public List<Sensor> getSensorsByEquipement(Long idEquipement) {
        return sensorRepository.findByIdEquipement(idEquipement);
    }

    // Ajouter un capteur
    public Sensor addSensor(Sensor sensor) {
        return sensorRepository.save(sensor);
    }

    // Mettre à jour un capteur
    public Sensor updateSensor(Long id, Sensor updatedSensor) {
        return sensorRepository.findById(id).map(sensor -> {
            sensor.setType(updatedSensor.getType());
            sensor.setDescription(updatedSensor.getDescription());
            sensor.setIdEquipement(updatedSensor.getIdEquipement());
            return sensorRepository.save(sensor);
        }).orElseThrow(() -> new RuntimeException("Capteur non trouvé"));
    }

    // Supprimer un capteur
    public void deleteSensor(Long id) {
        sensorRepository.deleteById(id);
    }
}
