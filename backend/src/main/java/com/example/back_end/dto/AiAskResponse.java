package com.example.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAskResponse {
    private String question;
    private String answer;
    private List<Map<String, Object>> sources;
    private String llmModel;
    private String embeddingModel;
    private Long latencyMs;
    private Boolean isSimulatedFallback;
}
