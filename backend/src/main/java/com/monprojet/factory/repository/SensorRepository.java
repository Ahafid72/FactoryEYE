package com.monprojet.factory.repository;

import com.monprojet.factory.entity.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorRepository extends JpaRepository<Sensor, Long> {
    List<Sensor> findByIdEquipement(Long idEquipement); // Recherche par équipement
}
