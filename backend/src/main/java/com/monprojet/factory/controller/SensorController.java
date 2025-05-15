package com.monprojet.factory.controller;

import com.monprojet.factory.entity.Sensor;
import com.monprojet.factory.service.SensorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sensors")
@CrossOrigin(origins = "*") // Permet l'accès depuis le frontend
public class SensorController {

    @Autowired
    private SensorService sensorService;

    // Récupérer tous les capteurs
    @GetMapping
    public List<Sensor> getAllSensors() {
        return sensorService.getAllSensors();
    }

    // Récupérer un capteur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Sensor> getSensorById(@PathVariable Long id) {
        Optional<Sensor> sensor = sensorService.getSensorById(id);
        return sensor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Récupérer les capteurs d'un équipement
    @GetMapping("/equipement/{idEquipement}")
    public List<Sensor> getSensorsByEquipement(@PathVariable Long idEquipement) {
        return sensorService.getSensorsByEquipement(idEquipement);
    }

    // Ajouter un capteur
    @PostMapping
    public Sensor addSensor(@RequestBody Sensor sensor) {
        return sensorService.addSensor(sensor);
    }

    // Mettre à jour un capteur
    @PutMapping("/{id}")
    public ResponseEntity<Sensor> updateSensor(@PathVariable Long id, @RequestBody Sensor updatedSensor) {
        try {
            Sensor sensor = sensorService.updateSensor(id, updatedSensor);
            return ResponseEntity.ok(sensor);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un capteur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSensor(@PathVariable Long id) {
        sensorService.deleteSensor(id);
        return ResponseEntity.noContent().build();
    }
}
