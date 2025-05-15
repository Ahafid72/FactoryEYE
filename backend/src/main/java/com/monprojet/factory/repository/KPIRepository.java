package com.monprojet.factory.repository;


import  com.monprojet.factory.entity.Kpi;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KpiRepository extends JpaRepository<Kpi, Long> {
}