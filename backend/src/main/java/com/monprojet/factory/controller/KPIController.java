package com.monprojet.factory.controller;


import com.monprojet.factory.dto.KpiDto;
import com.monprojet.factory.dto.KpiUpdateDto;
import com.monprojet.factory.service.KpiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kpis")
@RequiredArgsConstructor
public class KpiController {
    private final KpiService kpiService;

    @GetMapping
    public ResponseEntity<List<KpiDto>> getAllKpis() {
        return ResponseEntity.ok(kpiService.getAllKpis());
    }

    @PutMapping("/{id}")
    public ResponseEntity<KpiDto> updateKpiValue(
            @PathVariable Long id,
            @RequestBody KpiUpdateDto updateDto) {
        return ResponseEntity.ok(kpiService.updateKpiValue(id, updateDto));
    }
}