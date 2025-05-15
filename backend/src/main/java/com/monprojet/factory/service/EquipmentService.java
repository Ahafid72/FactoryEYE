package com.monprojet.factory.service;

import com.monprojet.factory.entity.Equipment;
import com.monprojet.factory.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    // Nouvelle méthode pour le total
    public Long getTotalEquipmentCount() {
        return equipmentRepository.count();
    }

    // Méthodes existantes conservées
    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    public Optional<Equipment> getEquipmentById(Long id) {
        return equipmentRepository.findById(id);
    }

    public List<Equipment> getEquipmentByStatus(String status) {
        return equipmentRepository.findByStatus(status);
    }

    public Equipment addEquipment(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }

    public Equipment updateEquipment(Long id, Equipment updatedEquipment) {
        return equipmentRepository.findById(id).map(equipment -> {
            equipment.setName(updatedEquipment.getName());
            equipment.setStatus(updatedEquipment.getStatus());
            equipment.setType(updatedEquipment.getType());
            return equipmentRepository.save(equipment);
        }).orElseThrow(() -> new RuntimeException("Équipement non trouvé"));
    }

    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }
}