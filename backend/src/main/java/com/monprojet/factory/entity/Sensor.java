package com.monprojet.factory.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Sensors") // Assurez-vous que c'est bien le nom exact dans la BDD
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Sensor_id")
    private Long id;

    @Column(name = "Sensor_type", nullable = false)
    private String type;

    @Column(name = "Description")
    private String description;

    @Column(name = "id_equipement", nullable = false)
    private Long idEquipement;

    // Constructeurs
    public Sensor() {}

    public Sensor(String type, String description, Long idEquipement) {
        this.type = type;
        this.description = description;
        this.idEquipement = idEquipement;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getIdEquipement() {
        return idEquipement;
    }

    public void setIdEquipement(Long idEquipement) {
        this.idEquipement = idEquipement;
    }
}
