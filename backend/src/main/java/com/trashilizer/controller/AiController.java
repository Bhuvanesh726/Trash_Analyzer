package com.trashilizer.controller;

import com.trashilizer.dto.DashboardStatsDTO;
import com.trashilizer.service.AiAnalysisService;
import com.trashilizer.service.WasteRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiAnalysisService aiService;

    @Autowired
    private WasteRecordService wasteService;

    @GetMapping("/analyze")
    public Map<String, String> getAnalysis() {
        DashboardStatsDTO stats = wasteService.getDashboardStats();
        String analysis = aiService.generateAnalysis(stats);
        return Map.of("analysis", analysis);
    }
}
