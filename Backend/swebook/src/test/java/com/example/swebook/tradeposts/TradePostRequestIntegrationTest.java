package com.example.swebook.tradeposts;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "spring.datasource.url=jdbc:sqlite:./build/test-swebook.sqlite"
)
class TradePostRequestIntegrationTest {

    static {
        resetDatabase();
    }

    @LocalServerPort
    private int port;

    @Autowired
    private ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    private static void resetDatabase() {
        Path testDatabasePath = Path.of("build/test-swebook.sqlite").toAbsolutePath().normalize();
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("./scripts/reset-sqlite-db.sh")
                    .directory(Path.of(".").toAbsolutePath().normalize().toFile())
                    .redirectErrorStream(true);
            processBuilder.environment().put("SWEBOOK_DB_PATH", testDatabasePath.toString());

            Process process = processBuilder.start();
            String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new IllegalStateException(output);
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to reset test SQLite database", e);
        }
    }

    @Test
    void createTradeRequest_matchesSeedAvailableTimeAndMarksItRequested() throws Exception {
        HttpResponse<String> createResponse = postJson(
                "/api/trade-posts/18/requests",
                """
                {
                  "userId": 1,
                  "availableTime": "2026-06-25T11:00:00"
                }
                """
        );

        assertThat(createResponse.statusCode()).isEqualTo(201);
        JsonNode createBody = objectMapper.readTree(createResponse.body());
        assertThat(createBody.path("success").asBoolean()).isTrue();
        assertThat(createBody.path("data").path("postId").asLong()).isEqualTo(18);
        assertThat(createBody.path("data").path("requestStatus").asText()).isEqualTo("PENDING");

        HttpResponse<String> availableTimesResponse = get("/api/trade-posts/18/available-times");

        assertThat(availableTimesResponse.statusCode()).isEqualTo(200);
        JsonNode requestedTime = objectMapper.readTree(availableTimesResponse.body())
                .path("data")
                .path("availableTimes")
                .get(0);
        assertThat(requestedTime.path("id").asText()).isEqualTo("35");
        assertThat(requestedTime.path("isRequested").asBoolean()).isTrue();
    }

    @Test
    void createTradeRequest_acceptsTimeInsideAvailableRange() throws Exception {
        HttpResponse<String> createResponse = postJson(
                "/api/trade-posts/17/requests",
                """
                {
                  "userId": 3,
                  "availableTime": "%s"
                }
                """.formatted(LocalDateTime.parse("2026-06-24T10:30:00"))
        );

        assertThat(createResponse.statusCode()).isEqualTo(201);
        JsonNode createBody = objectMapper.readTree(createResponse.body());
        assertThat(createBody.path("success").asBoolean()).isTrue();
    }

    private HttpResponse<String> postJson(String path, String body) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create(url(path)))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create(url(path)))
                .GET()
                .build();

        return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private String url(String path) {
        return "http://localhost:" + port + path;
    }
}
