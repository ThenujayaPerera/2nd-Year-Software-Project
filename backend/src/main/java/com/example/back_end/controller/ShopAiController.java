package com.example.back_end.controller;

import com.example.back_end.dto.AiAskRequest;
import com.example.back_end.dto.AiAskResponse;
import com.example.back_end.entity.ShopKnowledge;
import com.example.back_end.repository.ShopKnowledgeRepository;
import com.example.back_end.service.RagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ShopAiController {

    private final RagService ragService;
    private final ShopKnowledgeRepository shopKnowledgeRepository;

    /**
     * Ask NVSHOP.LK AI Store Assistant using Groq LLM + Gemini Embeddings + Supabase pgvector
     */
    @PostMapping("/ai/ask")
    public ResponseEntity<AiAskResponse> askAi(@RequestBody AiAskRequest request) {
        if (request == null || request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    AiAskResponse.builder()
                            .question("")
                            .answer("Please provide a valid question to the store assistant.")
                            .sources(List.of())
                            .llmModel("none")
                            .embeddingModel("none")
                            .latencyMs(0L)
                            .isSimulatedFallback(true)
                            .build()
            );
        }

        AiAskResponse response = ragService.askShopAssistant(request.getQuestion().trim());
        return ResponseEntity.ok(response);
    }

    /**
     * Admin: Get all knowledge chunks in vector database
     */
    @GetMapping("/admin/ai/knowledge")
    public ResponseEntity<List<ShopKnowledge>> getKnowledgeList() {
        List<ShopKnowledge> list = shopKnowledgeRepository.findAll();
        return ResponseEntity.ok(list);
    }

    /**
     * Admin: Create or update a knowledge chunk
     */
    @PostMapping("/admin/ai/knowledge")
    public ResponseEntity<ShopKnowledge> saveKnowledge(@RequestBody ShopKnowledge chunk) {
        ShopKnowledge saved = shopKnowledgeRepository.save(chunk);
        log.info("Saved knowledge chunk: ID={}, Title={}", saved.getId(), saved.getTitle());
        return ResponseEntity.ok(saved);
    }

    /**
     * Admin: Delete a knowledge chunk
     */
    @DeleteMapping("/admin/ai/knowledge/{id}")
    public ResponseEntity<?> deleteKnowledge(@PathVariable Long id) {
        if (!shopKnowledgeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        shopKnowledgeRepository.deleteById(id);
        log.info("Deleted knowledge chunk ID={}", id);
        return ResponseEntity.ok(Map.of("message", "Knowledge chunk deleted successfully", "id", id));
    }

    /**
     * Admin: Trigger batch Gemini embedding sync in Supabase pgvector
     */
    @PostMapping("/admin/ai/sync-embeddings")
    public ResponseEntity<?> syncEmbeddings() {
        log.info("Triggering vector embedding synchronization...");
        Map<String, Object> result = ragService.syncEmbeddings();
        return ResponseEntity.ok(result);
    }

    /**
     * Admin/Health: Check live connectivity of Groq, Gemini Embeddings, and pgvector
     */
    @GetMapping("/admin/ai/check")
    public ResponseEntity<?> checkApis() {
        Map<String, Object> status = ragService.checkApiStatus();
        return ResponseEntity.ok(status);
    }
}
