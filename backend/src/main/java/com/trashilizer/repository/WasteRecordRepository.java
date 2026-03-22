package com.trashilizer.repository;

import com.trashilizer.model.WasteRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WasteRecordRepository extends JpaRepository<WasteRecord, Long> {
    List<WasteRecord> findBySkuId(String skuId);
    List<WasteRecord> findAllByOrderByEntryDateDesc();
}
