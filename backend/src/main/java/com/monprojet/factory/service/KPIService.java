package com.monprojet.factory.service;

import com.monprojet.factory.dto.KpiDto;
import com.monprojet.factory.dto.KpiUpdateDto;
import com.monprojet.factory.entity.Kpi;
import com.monprojet.factory.entity.KpiHistory;
import com.monprojet.factory.repository.KpiHistoryRepository;
import com.monprojet.factory.repository.KpiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KpiService {
    private final KpiRepository kpiRepository;
    private final KpiHistoryRepository kpiHistoryRepository;

    public List<KpiDto> getAllKpis() {
        return kpiRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public KpiDto updateKpiValue(Long id, KpiUpdateDto updateDto) {
        Kpi kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("KPI not found with id: " + id));

        // Save current value to history before updating
        KpiHistory history = new KpiHistory();
        history.setKpi(kpi);
        history.setValue(kpi.getValue());
        kpiHistoryRepository.save(history);

        // Update KPI value
        kpi.setValue(updateDto.getValue());
        Kpi updatedKpi = kpiRepository.save(kpi);

        return convertToDto(updatedKpi);
    }

    private KpiDto convertToDto(Kpi kpi) {
        KpiDto dto = new KpiDto();
        dto.setId(kpi.getId());
        dto.setTitle(kpi.getTitle());
        dto.setValue(kpi.getValue());
        dto.setIconName(kpi.getIconName());
        dto.setColorClass(kpi.getColorClass());
        return dto;
    }
}