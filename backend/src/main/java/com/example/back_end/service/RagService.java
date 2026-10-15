package com.example.back_end.service;

import com.example.back_end.dto.AiAskResponse;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.ShopDetails;
import com.example.back_end.entity.ShopKnowledge;
import com.example.back_end.repository.ProductRepository;
import com.example.back_end.repository.ShopDetailsRepository;
import com.example.back_end.repository.ShopKnowledgeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagService {

    private final JdbcTemplate jdbcTemplate;
    private final ShopKnowledgeRepository shopKnowledgeRepository;
    private final ShopDetailsRepository shopDetailsRepository;
    private final ProductRepository productRepository;
    private final RestTemplate restTemplate = createTrustingRestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static RestTemplate createTrustingRestTemplate() {
        try {
            javax.net.ssl.TrustManager[] trustAllCerts = new javax.net.ssl.TrustManager[]{
                new javax.net.ssl.X509TrustManager() {
                    public java.security.cert.X509Certificate[] getAcceptedIssuers() { return new java.security.cert.X509Certificate[0]; }
                    public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                }
            };
            javax.net.ssl.SSLContext sslContext = javax.net.ssl.SSLContext.getInstance("TLS");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory() {
                @Override
                protected void prepareConnection(java.net.HttpURLConnection connection, String httpMethod) throws java.io.IOException {
                    if (connection instanceof javax.net.ssl.HttpsURLConnection) {
                        ((javax.net.ssl.HttpsURLConnection) connection).setSSLSocketFactory(sslContext.getSocketFactory());
                        ((javax.net.ssl.HttpsURLConnection) connection).setHostnameVerifier((hostname, session) -> true);
                    }
                    super.prepareConnection(connection, httpMethod);
                }
            };
            factory.setConnectTimeout(15000);
            factory.setReadTimeout(30000);
            return new RestTemplate(factory);
        } catch (Exception e) {
            return new RestTemplate();
        }
    }

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.embedding.model:gemini-embedding-001}")
    private String geminiEmbeddingModel;

    @Value("${groq.api.key:}")
    private String groqApiKey;

    @Value("${groq.model:qwen/qwen3.8-27b}")
    private String groqModel;

    @Value("${groq.url:https://api.groq.com/openai/v1/chat/completions}")
    private String groqUrl;

    /**
     * Ask NVSHOP.LK AI Assistant using RAG (Retrieval-Augmented Generation)
     */
    public AiAskResponse askShopAssistant(String userQuestion) {
        long startTime = System.currentTimeMillis();
        boolean isSimulated = false;

        // 1. Retrieve relevant knowledge chunks using pgvector (or keyword fallback)
        List<ShopKnowledge> retrievedChunks = searchRelevantKnowledge(userQuestion, 4);

        // 2. Build Context String
        StringBuilder contextBuilder = new StringBuilder();
        List<Map<String, Object>> sourceList = new ArrayList<>();

        if (!retrievedChunks.isEmpty()) {
            for (ShopKnowledge chunk : retrievedChunks) {
                contextBuilder.append("--- ")
                        .append(chunk.getTitle())
                        .append(" (Category: ").append(chunk.getCategory()).append(") ---\n")
                        .append(chunk.getContent())
                        .append("\n\n");

                Map<String, Object> src = new HashMap<>();
                src.put("id", chunk.getId());
                src.put("title", chunk.getTitle());
                src.put("category", chunk.getCategory());
                src.put("similarity", chunk.getSimilarityScore() != null ? chunk.getSimilarityScore() : 1.0);
                sourceList.add(src);
            }
        } else {
            // Append shop details overview if no chunk matched
            Optional<ShopDetails> shopDetailsOpt = shopDetailsRepository.findFirstByOrderByIdAsc();
            if (shopDetailsOpt.isPresent()) {
                ShopDetails sd = shopDetailsOpt.get();
                contextBuilder.append("Store: ").append(sd.getShopName()).append("\n")
                        .append("Address: ").append(sd.getAddress()).append("\n")
                        .append("Hotline: ").append(sd.getHotline()).append("\n")
                        .append("Hours: ").append(sd.getBusinessHours()).append("\n")
                        .append("Warranty: ").append(sd.getWarrantyPolicy()).append("\n")
                        .append("Delivery: ").append(sd.getShippingPolicy()).append("\n\n");
            }
        }

        // Search live inventory for products relevant to user query
        try {
            List<Product> matchedProducts = productRepository.searchProducts(userQuestion);
            if (matchedProducts.isEmpty()) {
                String[] words = userQuestion.replaceAll("[^a-zA-Z0-9 ]", "").split("\\s+");
                for (String w : words) {
                    if (w.length() >= 4 && !w.equalsIgnoreCase("what") && !w.equalsIgnoreCase("your")
                            && !w.equalsIgnoreCase("have") && !w.equalsIgnoreCase("with") && !w.equalsIgnoreCase("about")) {
                        List<Product> partial = productRepository.searchProducts(w);
                        if (!partial.isEmpty()) {
                            matchedProducts = partial;
                            break;
                        }
                    }
                }
            }

            if (matchedProducts != null && !matchedProducts.isEmpty()) {
                contextBuilder.append("--- IN-STOCK STORE PRODUCTS RELATED TO CUSTOMER INQUIRY ---\n");
                for (Product p : matchedProducts.stream().limit(5).toList()) {
                    contextBuilder.append("• ").append(p.getName())
                            .append(" | Brand: ").append(p.getBrand())
                            .append(" | Price: Rs. ").append(String.format("%,.0f", p.getPrice()))
                            .append(" | Official Warranty: ").append(p.getWarranty())
                            .append(" | In Stock: ").append(p.getStock() > 0 ? "Yes (" + p.getStock() + " units available)" : "Temporarily Out of Stock")
                            .append("\n");
                }
                contextBuilder.append("\n");
            }
        } catch (Exception e) {
            log.debug("Inventory lookup skipped: {}", e.getMessage());
        }

        // 3. Formulate Prompt with Courteous, Professional Customer Care Persona (Zero Emojis)
        String systemPrompt = "You are 'NV Support', the courteous, knowledgeable, and helpful Customer Care Specialist for NVSHOP.LK (Sri Lanka's leading authentic tech & lifestyle accessories store based in Ambalangoda).\n\n" +
                "YOUR CORE MISSION:\n" +
                "Make every customer feel valued and confident about shopping with NVSHOP.LK. " +
                "Answer their questions clearly, accurately, and politely — like a dedicated retail technical support specialist.\n\n" +
                "CRITICAL FORMATTING INSTRUCTION:\n" +
                "ABSOLUTE RULE - NO EMOJIS: Do NOT use any emojis anywhere in your response under any circumstance (no smileys, no icons, no symbols such as phones, watches, boxes, trucks, shields, stars, or faces). Use clean textual labels, bold keywords, and plain bullet points (•) instead.\n\n" +
                "COMMUNICATION GUIDELINES:\n" +
                "1. Courteous Opening: Greet the customer politely (e.g., 'Hello! Welcome to NVSHOP.LK. I would be happy to help you with that.').\n" +
                "2. Clear & Direct Answer: Answer the customer's specific question immediately in the first paragraph in simple, crystal-clear language without confusing jargon.\n" +
                "3. Structured Details: When listing multiple facts, use clean bullet points (•) with clear text labels (such as [Location], [Opening Hours], [Official Warranty], [Delivery], [Price], [Payment Methods], [Hotline]).\n" +
                "4. Sri Lankan Context: Always use Sri Lankan Rupees (Rs. / LKR). Highlight our fast Island-wide delivery (1–3 business days with Cash on Delivery available) and Koko 3-installment interest-free BNPL when relevant.\n" +
                "5. Authentic Guarantee: Mention our 100% genuine company warranty (Anker/Soundcore: 18 Months Company Warranty, UGREEN/Apple: 1 Year, Smartwatches: 6 Months).\n" +
                "6. Physical Showroom: Mention our experiential store at 185/1/2B New Road, Ambalangoda, where customers can try sound stations and interactive VR demos.\n" +
                "7. Courteous Closing: Conclude with a helpful, inviting closing offering further assistance, and mention our official WhatsApp / Hotline at +94 77 123 4567.\n\n" +
                "TONE RULES:\n" +
                "- Never say 'Based on the provided documents' or 'The context does not state'.\n" +
                "- If a specific detail is outside the knowledge base, politely invite the customer to message our live WhatsApp team at +94 77 123 4567.\n" +
                "- Absolute rule: ZERO emojis in all responses.";

        String userPrompt = "VERIFIED STORE KNOWLEDGE & INVENTORY:\n" + contextBuilder.toString() +
                "\nCUSTOMER QUESTION: " + userQuestion;

        // 4. Generate Answer via Groq LLM (with graceful simulated fallback if key is blank)
        String answer;
        if (StringUtils.hasText(groqApiKey)) {
            try {
                answer = callGroqChatCompletion(systemPrompt, userPrompt);
            } catch (Exception e) {
                log.warn("Groq API call failed: {}. Using structured customer care context fallback.", e.getMessage());
                answer = generateContextFallbackAnswer(userQuestion, retrievedChunks);
                isSimulated = true;
            }
        } else {
            log.info("Groq API key not set in environment. Generating structured customer care context fallback.");
            answer = generateContextFallbackAnswer(userQuestion, retrievedChunks);
            isSimulated = true;
        }

        long latency = System.currentTimeMillis() - startTime;

        return AiAskResponse.builder()
                .question(userQuestion)
                .answer(answer)
                .sources(sourceList)
                .llmModel(isSimulated ? "RAG-Knowledge-Fallback" : groqModel)
                .embeddingModel(StringUtils.hasText(geminiApiKey) ? geminiEmbeddingModel : "Keyword-Ranker")
                .latencyMs(latency)
                .isSimulatedFallback(isSimulated)
                .build();
    }

    /**
     * Search relevant knowledge using Supabase pgvector cosine similarity, with keyword search fallback
     */
    public List<ShopKnowledge> searchRelevantKnowledge(String query, int limit) {
        // Attempt vector embedding via Gemini first
        if (StringUtils.hasText(geminiApiKey)) {
            try {
                List<Double> queryVector = getGeminiEmbedding(query);
                if (queryVector != null && !queryVector.isEmpty()) {
                    String vectorStr = formatVectorString(queryVector);

                    // Execute cosine distance search on pgvector column
                    String sql = "SELECT id, category, title, content, created_at, updated_at, " +
                            " (1 - (embedding <=> cast(? as vector))) AS similarity " +
                            " FROM shop_knowledge " +
                            " WHERE embedding IS NOT NULL " +
                            " ORDER BY embedding <=> cast(? as vector) " +
                            " LIMIT ?";

                    List<ShopKnowledge> vectorResults = jdbcTemplate.query(
                            sql,
                            (rs, rowNum) -> {
                                ShopKnowledge sk = new ShopKnowledge();
                                sk.setId(rs.getLong("id"));
                                sk.setCategory(rs.getString("category"));
                                sk.setTitle(rs.getString("title"));
                                sk.setContent(rs.getString("content"));
                                double sim = rs.getDouble("similarity");
                                sk.setSimilarityScore(Math.round(sim * 100.0) / 100.0);
                                sk.setHasVectorEmbedding(true);
                                return sk;
                            },
                            vectorStr, vectorStr, limit
                    );

                    if (!vectorResults.isEmpty()) {
                        log.info("Retrieved {} knowledge chunks via Supabase pgvector cosine similarity", vectorResults.size());
                        return vectorResults;
                    }
                }
            } catch (Exception e) {
                log.warn("Vector similarity query failed: {}. Falling back to keyword search.", e.getMessage());
            }
        }

        // Fallback: Keyword search in PostgreSQL
        List<ShopKnowledge> keywordResults = shopKnowledgeRepository.searchByKeyword(query);
        if (!keywordResults.isEmpty()) {
            return keywordResults.stream().limit(limit).peek(k -> {
                k.setSimilarityScore(0.85);
                k.setHasVectorEmbedding(false);
            }).collect(Collectors.toList());
        }

        return shopKnowledgeRepository.findAll().stream().limit(limit).collect(Collectors.toList());
    }

    /**
     * Generate 768-dim vector embedding using Google Gemini Embeddings API (text-embedding-004)
     * Zero local model installation required.
     */
    public List<Double> getGeminiEmbedding(String text) {
        if (!StringUtils.hasText(geminiApiKey) || !StringUtils.hasText(text)) {
            return Collections.emptyList();
        }

        try {
            String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:embedContent?key=%s",
                    geminiEmbeddingModel, geminiApiKey);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = Map.of(
                    "model", "models/" + geminiEmbeddingModel,
                    "content", Map.of(
                            "parts", List.of(
                                     Map.of("text", text)
                            )
                    ),
                    "outputDimensionality", 768
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode valuesNode = root.path("embedding").path("values");
                if (valuesNode.isArray()) {
                    List<Double> vector = new ArrayList<>();
                    for (JsonNode val : valuesNode) {
                        vector.add(val.asDouble());
                    }
                    return vector;
                }
            }
        } catch (Exception e) {
            log.warn("Gemini embedding API call failed: {}", e.getMessage());
        }
        return Collections.emptyList();
    }

    /**
     * Call Groq Cloud LLM API with OpenAI-compatible payload
     */
    private String callGroqChatCompletion(String systemPrompt, String userPrompt) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        Map<String, Object> requestBody = Map.of(
                "model", groqModel,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)
                ),
                "temperature", 0.4,
                "max_tokens", 800
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(groqUrl, request, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                return choices.get(0).path("message").path("content").asText();
            }
        }
        throw new RuntimeException("Empty response from Groq API");
    }

    /**
     * Sync and update Gemini embeddings for all knowledge chunks in Supabase PostgreSQL
     */
    public Map<String, Object> syncEmbeddings() {
        if (!StringUtils.hasText(geminiApiKey)) {
            return Map.of(
                    "status", "SKIPPED",
                    "message", "GEMINI_API_KEY is not configured in backend .env. Set the key to generate live 768-dim embeddings.",
                    "syncedCount", 0
            );
        }

        List<ShopKnowledge> chunks = shopKnowledgeRepository.findAll();
        int successCount = 0;
        int failureCount = 0;

        for (ShopKnowledge chunk : chunks) {
            try {
                String textToEmbed = chunk.getTitle() + "\n" + chunk.getContent();
                List<Double> vector = getGeminiEmbedding(textToEmbed);
                if (vector != null && vector.size() == 768) {
                    String vectorStr = formatVectorString(vector);
                    jdbcTemplate.update(
                            "UPDATE shop_knowledge SET embedding = cast(? as vector), updated_at = NOW() WHERE id = ?",
                            vectorStr, chunk.getId()
                    );
                    successCount++;
                } else {
                    failureCount++;
                }
            } catch (Exception e) {
                log.warn("Error updating embedding for chunk ID {}: {}", chunk.getId(), e.getMessage());
                failureCount++;
            }
        }

        return Map.of(
                "status", "SUCCESS",
                "totalChunks", chunks.size(),
                "syncedCount", successCount,
                "failedCount", failureCount,
                "embeddingModel", geminiEmbeddingModel
        );
    }

    private String formatVectorString(List<Double> vector) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.size(); i++) {
            sb.append(vector.get(i));
            if (i < vector.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    private String generateContextFallbackAnswer(String question, List<ShopKnowledge> chunks) {
        StringBuilder sb = new StringBuilder();
        sb.append("Hello! Welcome to NVSHOP.LK Customer Support.\n\n");

        if (chunks == null || chunks.isEmpty()) {
            sb.append("Thank you for reaching out to us. We are Sri Lanka's premier authentic tech accessories store, located at **185/1/2B New Road, Ambalangoda**.\n\n")
              .append("• **Showroom:** 185/1/2B New Road, Ambalangoda\n")
              .append("• **Opening Hours:** Mon - Sat: 9:00 AM - 7:30 PM | Sun: 10:00 AM - 5:00 PM\n")
              .append("• **Hotline & WhatsApp:** +94 77 123 4567\n")
              .append("• **Delivery:** Island-wide delivery in 1-3 business days (Cash on Delivery available)\n\n")
              .append("How can we assist you today? Please let us know if you need information regarding our genuine smart watches, GaN fast chargers, power banks, Soundcore earbuds, or official warranties.");
            return sb.toString();
        }

        ShopKnowledge topChunk = chunks.get(0);
        sb.append("I would be glad to help you with that.\n\n");
        sb.append(topChunk.getContent()).append("\n\n");

        if (chunks.size() > 1) {
            ShopKnowledge secondChunk = chunks.get(1);
            sb.append("**Additional Store Information (").append(secondChunk.getTitle()).append("):**\n");
            sb.append(secondChunk.getContent()).append("\n\n");
        }

        sb.append("---\n");
        sb.append("*Have more questions or need to place an order? Our team is always here to help you on WhatsApp at **+94 77 123 4567** or at our showroom in Ambalangoda.*");
        return sb.toString();
    }

    /**
     * Check status and connectivity of Groq LLM, Gemini Embeddings, and pgvector
     */
    public Map<String, Object> checkApiStatus() {
        Map<String, Object> result = new LinkedHashMap<>();

        // 1. Check Groq LLM
        Map<String, Object> groqStatus = new LinkedHashMap<>();
        boolean hasGroqKey = StringUtils.hasText(groqApiKey);
        groqStatus.put("configured", hasGroqKey);
        groqStatus.put("model", groqModel);
        if (hasGroqKey) {
            try {
                long start = System.currentTimeMillis();
                String testAnswer = callGroqChatCompletion("You are a ping test assistant.", "Respond with only 'PONG'.");
                long latency = System.currentTimeMillis() - start;
                groqStatus.put("status", "HEALTHY");
                groqStatus.put("latencyMs", latency);
                groqStatus.put("responseSnippet", testAnswer.trim());
            } catch (Exception e) {
                groqStatus.put("status", "ERROR");
                groqStatus.put("error", e.getMessage());
            }
        } else {
            groqStatus.put("status", "NOT_CONFIGURED");
            groqStatus.put("note", "Add GROQ_API_KEY to backend/.env and save file");
        }
        result.put("groq", groqStatus);

        // 2. Check Gemini Embeddings
        Map<String, Object> geminiStatus = new LinkedHashMap<>();
        boolean hasGeminiKey = StringUtils.hasText(geminiApiKey);
        geminiStatus.put("configured", hasGeminiKey);
        geminiStatus.put("model", geminiEmbeddingModel);
        if (hasGeminiKey) {
            try {
                long start = System.currentTimeMillis();
                List<Double> vector = getGeminiEmbedding("ping test");
                long latency = System.currentTimeMillis() - start;
                if (vector != null && !vector.isEmpty()) {
                    geminiStatus.put("status", "HEALTHY");
                    geminiStatus.put("dimensions", vector.size());
                    geminiStatus.put("latencyMs", latency);
                } else {
                    geminiStatus.put("status", "EMPTY_RESPONSE");
                }
            } catch (Exception e) {
                geminiStatus.put("status", "ERROR");
                geminiStatus.put("error", e.getMessage());
            }
        } else {
            geminiStatus.put("status", "NOT_CONFIGURED");
            geminiStatus.put("note", "Add GEMINI_API_KEY to backend/.env and save file");
        }
        result.put("gemini", geminiStatus);

        // 3. Check Supabase pgvector
        Map<String, Object> pgvectorStatus = new LinkedHashMap<>();
        try {
            Integer vecCheck = jdbcTemplate.queryForObject(
                    "SELECT 1 FROM pg_extension WHERE extname = 'vector'", Integer.class);
            pgvectorStatus.put("extensionInstalled", vecCheck != null && vecCheck == 1);

            Integer chunkCount = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM shop_knowledge", Integer.class);
            pgvectorStatus.put("knowledgeChunksCount", chunkCount != null ? chunkCount : 0);

            Integer embeddedCount = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM shop_knowledge WHERE embedding IS NOT NULL", Integer.class);
            pgvectorStatus.put("embeddedChunksCount", embeddedCount != null ? embeddedCount : 0);
            pgvectorStatus.put("status", "HEALTHY");
        } catch (Exception e) {
            pgvectorStatus.put("status", "UNAVAILABLE_OR_FALLBACK");
            pgvectorStatus.put("error", e.getMessage());
        }
        result.put("pgvector", pgvectorStatus);

        return result;
    }

    /**
     * AI Product Comparison using Groq LLM:
     * - Supports comparing 2 or 3 products side-by-side.
     * - Detects and explains mismatched / useless comparisons (e.g. phone vs phone case).
     * - Performs balanced, unbiased comparison for comparable items without guessing user preference.
     * - Enforces NO EMOJIS in all text outputs.
     */
    public Map<String, Object> compareProducts(Product p1, Product p2) {
        if (p1 == null || p2 == null) {
            return Map.of("error", "Invalid products provided for comparison");
        }
        return compareProducts(List.of(p1, p2));
    }

    public Map<String, Object> compareProducts(List<Product> products) {
        if (products == null || products.size() < 2) {
            return Map.of("error", "At least 2 products are required for comparison");
        }

        Product p1 = products.get(0);
        Product p2 = products.get(1);
        Product p3 = products.size() >= 3 ? products.get(2) : null;

        // 1. Detect category mismatch heuristics
        boolean obviouslyMismatched = false;
        List<String> categories = products.stream()
                .map(p -> p.getCategory() != null ? p.getCategory().trim().toLowerCase() : "")
                .toList();

        boolean hasCase = categories.stream().anyMatch(c -> c.contains("case") || c.contains("protection") || c.contains("tempered"));
        boolean hasHardware = categories.stream().anyMatch(c -> c.contains("phone") || c.contains("watch") || c.contains("audio") || c.contains("speaker") || c.contains("charger") || c.contains("power"));
        if (hasCase && hasHardware) {
            obviouslyMismatched = true;
        }

        // 2. Prepare Groq Prompt
        String systemPrompt = "You are the official Technical Product Advisor for NVSHOP.LK in Sri Lanka.\n\n" +
                "YOUR CORE RULES:\n" +
                "1. STRICT RULE - NO EMOJIS: Do NOT include any emojis anywhere in your output under any condition. Use clean plain text labels and clear formatting.\n" +
                "2. DETECT MISMATCHED / APPLES-TO-ORANGES COMPARISONS:\n" +
                "   If the products belong to different functional categories where comparing them directly as competing choices makes no sense (for example: comparing a smartphone with a phone case, or a charger with an earphone, or a cable with a smartwatch):\n" +
                "   - Set 'isMismatchedCategory': true\n" +
                "   - Provide a clear, polite explanation in 'mismatchedExplanation' explaining why this comparison is mismatched.\n" +
                "3. UNBIASED, OBJECTIVE COMPARISON FOR COMPARABLE PRODUCTS:\n" +
                "   When comparing products of the same or comparable category:\n" +
                "   - Set 'isMismatchedCategory': false\n" +
                "   - ABSOLUTE NEUTRALITY: Do NOT guess customer preference or force an arbitrary single 'winner'. Each product has unique trade-offs.\n" +
                "   - COMPREHENSIVE TECHNICAL KNOWLEDGE: Combine the verified store database facts (name, brand, price in LKR, stock, warranty, description) with accurate technical specifications from hardware knowledge (display type like AMOLED vs TFT/IPS, battery endurance, IP ratings, fast charging wattage, companion app support, and build materials).\n" +
                "   - BALANCED ASSESSMENT: Clearly list the key technical differences across all products compared.\n" +
                "4. OUTPUT FORMAT: Respond ONLY with a valid JSON object matching this schema:\n" +
                "{\n" +
                "  \"isMismatchedCategory\": boolean,\n" +
                "  \"mismatchedExplanation\": \"string\",\n" +
                "  \"comparisonTitle\": \"string\",\n" +
                "  \"comparisonSummary\": \"string\",\n" +
                "  \"keyDifferences\": [\n" +
                (p3 != null
                    ? "    { \"feature\": \"string\", \"product1\": \"string\", \"product2\": \"string\", \"product3\": \"string\" }\n"
                    : "    { \"feature\": \"string\", \"product1\": \"string\", \"product2\": \"string\" }\n") +
                "  ],\n" +
                "  \"strengthsP1\": [\"string\"],\n" +
                "  \"strengthsP2\": [\"string\"],\n" +
                (p3 != null ? "  \"strengthsP3\": [\"string\"],\n" : "") +
                "  \"bestForP1\": \"string\",\n" +
                "  \"bestForP2\": \"string\",\n" +
                (p3 != null ? "  \"bestForP3\": \"string\",\n" : "") +
                "  \"buyingAdvice\": \"string\"\n" +
                "}";

        StringBuilder userPromptBuilder = new StringBuilder();
        userPromptBuilder.append(String.format("Compare these %d products from NVSHOP.LK catalog:\n\n", products.size()));
        for (int i = 0; i < products.size(); i++) {
            Product p = products.get(i);
            userPromptBuilder.append(String.format(
                    "PRODUCT %d:\n- ID: %d\n- Name: %s\n- Brand: %s\n- Category: %s\n- Price: Rs. %,.0f\n- Warranty: %s\n- Stock: %d\n- Rating: %.1f stars\n- Description: %s\n\n",
                    i + 1, p.getId(), p.getName(), p.getBrand(), p.getCategory(), p.getPrice(), p.getWarranty(), p.getStock(), p.getRating() != null ? p.getRating() : 4.5, p.getDescription()
            ));
        }
        userPromptBuilder.append("Analyze these products according to your instructions. Output strictly valid JSON with NO emojis.");

        if (StringUtils.hasText(groqApiKey)) {
            try {
                String jsonResponse = callGroqChatCompletion(systemPrompt, userPromptBuilder.toString());
                jsonResponse = jsonResponse.trim();
                if (jsonResponse.startsWith("```json")) {
                    jsonResponse = jsonResponse.substring(7);
                } else if (jsonResponse.startsWith("```")) {
                    jsonResponse = jsonResponse.substring(3);
                }
                if (jsonResponse.endsWith("```")) {
                    jsonResponse = jsonResponse.substring(0, jsonResponse.length() - 3);
                }
                jsonResponse = jsonResponse.trim();

                @SuppressWarnings("unchecked")
                Map<String, Object> aiReport = objectMapper.readValue(jsonResponse, Map.class);
                log.info("Successfully generated AI product comparison report for {} products via Groq ({})", products.size(), groqModel);
                Map<String, Object> res = new LinkedHashMap<>();
                res.put("product1", p1);
                res.put("product2", p2);
                if (p3 != null) res.put("product3", p3);
                res.put("aiReport", aiReport);
                return res;
            } catch (Exception e) {
                log.warn("Groq comparison call or JSON parsing failed: {}. Generating structured algorithmic report.", e.getMessage());
            }
        }

        // Algorithmic fallback if Groq offline
        Map<String, Object> fallbackReport = generateAlgorithmicComparison(products, obviouslyMismatched);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("product1", p1);
        res.put("product2", p2);
        if (p3 != null) res.put("product3", p3);
        res.put("aiReport", fallbackReport);
        return res;
    }

    private Map<String, Object> generateAlgorithmicComparison(List<Product> products, boolean isMismatched) {
        Product p1 = products.get(0);
        Product p2 = products.get(1);
        Product p3 = products.size() >= 3 ? products.get(2) : null;

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("isMismatchedCategory", isMismatched);
        if (isMismatched) {
            report.put("mismatchedExplanation", "The selected items fulfill fundamentally different roles in your tech setup. Rather than competing choices, they are typically paired together or serve distinct needs.");
            report.put("comparisonTitle", "Complementary Category Comparison: " + p1.getName() + " vs " + p2.getName() + (p3 != null ? " vs " + p3.getName() : ""));
            report.put("comparisonSummary", "These items serve different purposes and complement each other rather than competing directly.");
        } else {
            report.put("mismatchedExplanation", "");
            report.put("comparisonTitle", "Balanced Technical Comparison: " + p1.getName() + " vs " + p2.getName() + (p3 != null ? " vs " + p3.getName() : ""));
            report.put("comparisonSummary", "A neutral side-by-side analysis of specifications, price, warranty, and customer suitability for all " + products.size() + " models.");
        }

        List<Map<String, String>> diffs = new ArrayList<>();
        Map<String, String> priceDiff = new LinkedHashMap<>();
        priceDiff.put("feature", "Price (LKR)");
        priceDiff.put("product1", "Rs. " + String.format("%,.0f", p1.getPrice()));
        priceDiff.put("product2", "Rs. " + String.format("%,.0f", p2.getPrice()));
        if (p3 != null) priceDiff.put("product3", "Rs. " + String.format("%,.0f", p3.getPrice()));
        diffs.add(priceDiff);

        Map<String, String> warrantyDiff = new LinkedHashMap<>();
        warrantyDiff.put("feature", "Official Warranty");
        warrantyDiff.put("product1", p1.getWarranty() != null ? p1.getWarranty() : "Company Warranty");
        warrantyDiff.put("product2", p2.getWarranty() != null ? p2.getWarranty() : "Company Warranty");
        if (p3 != null) warrantyDiff.put("product3", p3.getWarranty() != null ? p3.getWarranty() : "Company Warranty");
        diffs.add(warrantyDiff);

        Map<String, String> brandDiff = new LinkedHashMap<>();
        brandDiff.put("feature", "Brand & Build");
        brandDiff.put("product1", p1.getBrand() != null ? p1.getBrand() : "Authentic");
        brandDiff.put("product2", p2.getBrand() != null ? p2.getBrand() : "Authentic");
        if (p3 != null) brandDiff.put("product3", p3.getBrand() != null ? p3.getBrand() : "Authentic");
        diffs.add(brandDiff);

        Map<String, String> ratingDiff = new LinkedHashMap<>();
        ratingDiff.put("feature", "User Rating");
        ratingDiff.put("product1", (p1.getRating() != null ? p1.getRating() : 4.5) + " / 5.0 Stars");
        ratingDiff.put("product2", (p2.getRating() != null ? p2.getRating() : 4.5) + " / 5.0 Stars");
        if (p3 != null) ratingDiff.put("product3", (p3.getRating() != null ? p3.getRating() : 4.5) + " / 5.0 Stars");
        diffs.add(ratingDiff);

        report.put("keyDifferences", diffs);

        report.put("strengthsP1", List.of(
            "Priced at Rs. " + String.format("%,.0f", p1.getPrice()),
            "Official warranty: " + (p1.getWarranty() != null ? p1.getWarranty() : "Standard"),
            "Customer rating: " + (p1.getRating() != null ? p1.getRating() : 4.5) + " out of 5 stars"
        ));
        report.put("strengthsP2", List.of(
            "Priced at Rs. " + String.format("%,.0f", p2.getPrice()),
            "Official warranty: " + (p2.getWarranty() != null ? p2.getWarranty() : "Standard"),
            "Customer rating: " + (p2.getRating() != null ? p2.getRating() : 4.5) + " out of 5 stars"
        ));
        if (p3 != null) {
            report.put("strengthsP3", List.of(
                "Priced at Rs. " + String.format("%,.0f", p3.getPrice()),
                "Official warranty: " + (p3.getWarranty() != null ? p3.getWarranty() : "Standard"),
                "Customer rating: " + (p3.getRating() != null ? p3.getRating() : 4.5) + " out of 5 stars"
            ));
        }

        report.put("bestForP1", "Buyers prioritizing " + p1.getName() + " with official verified warranty.");
        report.put("bestForP2", "Buyers prioritizing " + p2.getName() + " with official verified warranty.");
        if (p3 != null) {
            report.put("bestForP3", "Buyers prioritizing " + p3.getName() + " with official verified warranty.");
        }
        report.put("buyingAdvice", "All selected models are 100% genuine with official warranties at NVSHOP.LK. Choose according to your budget preferences and specific brand features.");

        return report;
    }
}
