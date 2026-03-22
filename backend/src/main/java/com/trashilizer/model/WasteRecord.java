package com.trashilizer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "waste_records")
public class WasteRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku_id", nullable = false, length = 50)
    private String skuId;

    @Column(name = "entry_date")
    private LocalDateTime entryDate;

    @Column(name = "paper_waste")
    private Float paper = 0f;

    @Column(name = "plastic_waste")
    private Float plastic = 0f;

    @Column(name = "wet_waste")
    private Float wet = 0f;

    @Column(name = "organic_waste")
    private Float organic = 0f;

    @Column(name = "defective_waste")
    private Float defective = 0f;

    // total_weight is a STORED generated column in MySQL – tell JPA it's read-only
    @Column(name = "total_weight", insertable = false, updatable = false)
    private Float totalWeight;

    // Constructors
    public WasteRecord() {
        this.entryDate = LocalDateTime.now();
    }

    public WasteRecord(String skuId, Float paper, Float plastic,
            Float wet, Float organic, Float defective) {
        this.skuId = skuId;
        this.entryDate = LocalDateTime.now();
        this.paper = paper;
        this.plastic = plastic;
        this.wet = wet;
        this.organic = organic;
        this.defective = defective;
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

    public Float getPaper() {
        return paper;
    }

    public void setPaper(Float paper) {
        this.paper = paper;
    }

    public Float getPlastic() {
        return plastic;
    }

    public void setPlastic(Float plastic) {
        this.plastic = plastic;
    }

    public Float getWet() {
        return wet;
    }

    public void setWet(Float wet) {
        this.wet = wet;
    }

    public Float getOrganic() {
        return organic;
    }

    public void setOrganic(Float organic) {
        this.organic = organic;
    }

    public Float getDefective() {
        return defective;
    }

    public void setDefective(Float defective) {
        this.defective = defective;
    }

    public Float getTotalWeight() {
        // Fall back to computed value if the DB column hasn't been read
        if (totalWeight != null)
            return totalWeight;
        return (paper != null ? paper : 0f) +
                (plastic != null ? plastic : 0f) +
                (wet != null ? wet : 0f) +
                (organic != null ? organic : 0f) +
                (defective != null ? defective : 0f);
    }
}
