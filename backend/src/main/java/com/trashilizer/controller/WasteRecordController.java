package com.trashilizer.controller;

import com.trashilizer.dto.DashboardStatsDTO;
import com.trashilizer.dto.WasteRecordDTO;
import com.trashilizer.model.WasteRecord;
import com.trashilizer.service.WasteRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waste-records")
public class WasteRecordController {

    @Autowired
    private WasteRecordService service;

    // GET all records (returns DTOs with frontend-friendly field names)
    @GetMapping
    public List<WasteRecordDTO> getAllRecords() {
        return service.getAllRecords();
    }

    // GET record by ID
    @GetMapping("/{id}")
    public ResponseEntity<WasteRecordDTO> getRecordById(@PathVariable Long id) {
        return service.getRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET records by SKU ID
    @GetMapping("/sku/{skuId}")
    public List<WasteRecordDTO> getRecordsBySkuId(@PathVariable String skuId) {
        return service.getRecordsBySkuId(skuId);
    }

    // GET dashboard aggregated statistics
    @GetMapping("/stats")
    public DashboardStatsDTO getDashboardStats() {
        return service.getDashboardStats();
    }

    // POST new record
    @PostMapping
    public WasteRecordDTO createRecord(@RequestBody WasteRecord record) {
        return service.createRecord(record);
    }

    // PUT update record
    @PutMapping("/{id}")
    public ResponseEntity<WasteRecordDTO> updateRecord(@PathVariable Long id,
            @RequestBody WasteRecord updated) {
        return service.updateRecord(id, updated)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        if (service.deleteRecord(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
