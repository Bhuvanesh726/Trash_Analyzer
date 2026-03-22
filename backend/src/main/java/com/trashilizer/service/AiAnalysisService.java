package com.trashilizer.service;

import com.trashilizer.dto.DashboardStatsDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiAnalysisService {

    @Value("${google.ai.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateAnalysis(DashboardStatsDTO stats) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                + apiKey;

        String prompt = String.format(
                "As an industrial sustainability expert, analyze these waste metrics for a Pharma-Industrial plant:\n" +
                        "- Total Records: %d\n" +
                        "- Total Waste: %.2f kg\n" +
                        "- Paper: %.2f kg\n" +
                        "- Plastic: %.2f kg\n" +
                        "- Wet: %.2f kg\n" +
                        "- Organic: %.2f kg\n" +
                        "- Defective: %.2f kg\n" +
                        "- Sustainability Score: %d/100\n" +
                        "- CO2 Saved: %.2f kg\n\n" +
                        "Provide a professional analysis in 3 bullet points:\n" +
                        "1. A summary of the current waste efficiency.\n" +
                        "2. Specific, actionable recycling recommendations for the SKU types shown.\n" +
                        "3. A future sustainability goal based on this data.\n" +
                        "Keep the tone professional and industrial.",
                stats.getTotalRecords(),
                stats.getTotalWeight(),
                stats.getTotalPaper(),
                stats.getTotalPlastic(),
                stats.getTotalWet(),
                stats.getTotalOrganic(),
                stats.getTotalDefective(),
                stats.getSustainabilityScore(),
                stats.getCo2Saved());

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)))));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

            if (response != null && response.containsKey("candidates")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");

                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);

                    @SuppressWarnings("unchecked")
                    Map<String, Object> content = (Map<String, Object>) candidate.get("content");

                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

                    if (parts != null && !parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
            return "Unable to generate AI analysis at this time.";
        } catch (Exception e) {
            return "AI Analysis failed: " + e.getMessage();
        }
    }
}
