package com.trashilizer.dto;

import java.time.LocalDateTime;

/**
 * DTO for sending waste records to the frontend.
 * Maps the backend field naming (paperWaste) to the frontend expected naming
 * (paper).
 */
public class WasteRecordDTO {

    private Long id;
    private String skuId;
    private LocalDateTime entryDate;
    private float paper;
    private float plastic;
    private float wet;
    private float organic;
    private float defective;
    private float totalWeight;

    public WasteRecordDTO() {
    }

    public WasteRecordDTO(Long id, String skuId, LocalDateTime entryDate,
            float paper, float plastic, float wet,
            float organic, float defective) {
        this.id = id;
        this.skuId = skuId;
        this.entryDate = entryDate;
        this.paper = paper;
        this.plastic = plastic;
        this.wet = wet;
        this.organic = organic;
        this.defective = defective;
        this.totalWeight = paper + plastic + wet + organic + defective;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSkuId() {
        return skuId;
    }

    public void setSkuId(String skuId) {
        this.skuId = skuId;
    }

    public LocalDateTime getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDateTime entryDate) {
        this.entryDate = entryDate;
    }

    public float getPaper() {
        return paper;
    }

    public void setPaper(float paper) {
        this.paper = paper;
    }

    public float getPlastic() {
        return plastic;
    }

    public void setPlastic(float plastic) {
        this.plastic = plastic;
    }

    public float getWet() {
        return wet;
    }

    public void setWet(float wet) {
        this.wet = wet;
    }

    public float getOrganic() {
        return organic;
    }

    public void setOrganic(float organic) {
        this.organic = organic;
    }

    public float getDefective() {
        return defective;
    }

    public void setDefective(float defective) {
        this.defective = defective;
    }

    public float getTotalWeight() {
        return totalWeight;
    }

    public void setTotalWeight(float totalWeight) {
        this.totalWeight = totalWeight;
    }
}
