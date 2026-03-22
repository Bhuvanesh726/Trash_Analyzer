package com.trashilizer.service;

import com.trashilizer.dto.DashboardStatsDTO;
import com.trashilizer.dto.WasteRecordDTO;
import com.trashilizer.model.WasteRecord;
import com.trashilizer.repository.WasteRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WasteRecordService {

    @Autowired
    private WasteRecordRepository repository;

    /**
     * Convert entity to DTO (maps paperWaste -> paper, etc.)
     */
    private WasteRecordDTO toDTO(WasteRecord record) {
        return new WasteRecordDTO(
                record.getId(),
                record.getSkuId(),
                record.getEntryDate(),
                record.getPaper() != null ? record.getPaper() : 0f,
                record.getPlastic() != null ? record.getPlastic() : 0f,
                record.getWet() != null ? record.getWet() : 0f,
                record.getOrganic() != null ? record.getOrganic() : 0f,
                record.getDefective() != null ? record.getDefective() : 0f);
    }

    /**
     * Get all records ordered by entry date descending
     */
    public List<WasteRecordDTO> getAllRecords() {
        return repository.findAllByOrderByEntryDateDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a record by its id
     */
    public Optional<WasteRecordDTO> getRecordById(Long id) {
        return repository.findById(id).map(this::toDTO);
    }

    /**
     * Get all records by SKU id
     */
    public List<WasteRecordDTO> getRecordsBySkuId(String skuId) {
        return repository.findBySkuId(skuId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new waste record
     */
    public WasteRecordDTO createRecord(WasteRecord record) {
        WasteRecord saved = repository.save(record);
        return toDTO(saved);
    }

    /**
     * Update an existing waste record
     */
    public Optional<WasteRecordDTO> updateRecord(Long id, WasteRecord updated) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setSkuId(updated.getSkuId());
                    existing.setPaper(updated.getPaper());
                    existing.setPlastic(updated.getPlastic());
                    existing.setWet(updated.getWet());
                    existing.setOrganic(updated.getOrganic());
                    existing.setDefective(updated.getDefective());
                    return toDTO(repository.save(existing));
                });
    }

    /**
     * Delete a waste record by ID
     */
    public boolean deleteRecord(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Compute aggregated dashboard statistics from all records
     */
    public DashboardStatsDTO getDashboardStats() {
        List<WasteRecord> allRecords = repository.findAll();

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalRecords(allRecords.size());

        double totalPaper = 0, totalPlastic = 0, totalWet = 0, totalOrganic = 0, totalDefective = 0;

        for (WasteRecord r : allRecords) {
            totalPaper += r.getPaper() != null ? r.getPaper() : 0;
            totalPlastic += r.getPlastic() != null ? r.getPlastic() : 0;
            totalWet += r.getWet() != null ? r.getWet() : 0;
            totalOrganic += r.getOrganic() != null ? r.getOrganic() : 0;
            totalDefective += r.getDefective() != null ? r.getDefective() : 0;
        }

        double totalWeight = totalPaper + totalPlastic + totalWet + totalOrganic + totalDefective;
        double recyclable = totalPaper + totalPlastic;
        double co2Saved = totalPaper * 0.91 + totalPlastic * 1.5;
        int sustainabilityScore = totalWeight > 0
                ? (int) Math.min(100, Math.round((recyclable / totalWeight) * 100 * 1.2))
                : 0;

        stats.setTotalWeight(Math.round(totalWeight * 100.0) / 100.0);
        stats.setTotalPaper(Math.round(totalPaper * 100.0) / 100.0);
        stats.setTotalPlastic(Math.round(totalPlastic * 100.0) / 100.0);
        stats.setTotalWet(Math.round(totalWet * 100.0) / 100.0);
        stats.setTotalOrganic(Math.round(totalOrganic * 100.0) / 100.0);
        stats.setTotalDefective(Math.round(totalDefective * 100.0) / 100.0);
        stats.setRecyclableWeight(Math.round(recyclable * 100.0) / 100.0);
        stats.setSustainabilityScore(sustainabilityScore);
        stats.setCo2Saved(Math.round(co2Saved * 100.0) / 100.0);

        return stats;
    }
}
