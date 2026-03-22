package com.trashilizer.dto;

public class DashboardStatsDTO {

    private long totalRecords;
    private double totalWeight;
    private double totalPaper;
    private double totalPlastic;
    private double totalWet;
    private double totalOrganic;
    private double totalDefective;
    private double recyclableWeight;
    private int sustainabilityScore;
    private double co2Saved;

    public DashboardStatsDTO() {
    }

    // Getters and Setters
    public long getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(long totalRecords) {
        this.totalRecords = totalRecords;
    }

    public double getTotalWeight() {
        return totalWeight;
    }

    public void setTotalWeight(double totalWeight) {
        this.totalWeight = totalWeight;
    }

    public double getTotalPaper() {
        return totalPaper;
    }

    public void setTotalPaper(double totalPaper) {
        this.totalPaper = totalPaper;
    }

    public double getTotalPlastic() {
        return totalPlastic;
    }

    public void setTotalPlastic(double totalPlastic) {
        this.totalPlastic = totalPlastic;
    }

    public double getTotalWet() {
        return totalWet;
    }

    public void setTotalWet(double totalWet) {
        this.totalWet = totalWet;
    }

    public double getTotalOrganic() {
        return totalOrganic;
    }

    public void setTotalOrganic(double totalOrganic) {
        this.totalOrganic = totalOrganic;
    }

    public double getTotalDefective() {
        return totalDefective;
    }

    public void setTotalDefective(double totalDefective) {
        this.totalDefective = totalDefective;
    }

    public double getRecyclableWeight() {
        return recyclableWeight;
    }

    public void setRecyclableWeight(double recyclableWeight) {
        this.recyclableWeight = recyclableWeight;
    }

    public int getSustainabilityScore() {
        return sustainabilityScore;
    }

    public void setSustainabilityScore(int sustainabilityScore) {
        this.sustainabilityScore = sustainabilityScore;
    }

    public double getCo2Saved() {
        return co2Saved;
    }

    public void setCo2Saved(double co2Saved) {
        this.co2Saved = co2Saved;
    }
}
