package com.example.swebook.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI swebookOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("swebook API")
                        .description("위치 기반 전공서적 직거래 서비스 API")
                        .version("v0.0.1"));
    }

    @Bean
    public GroupedOpenApi booksApi() {
        return GroupedOpenApi.builder()
                .group("books")
                .pathsToMatch("/api/books/**")
                .build();
    }

    @Bean
    public GroupedOpenApi categoriesApi() {
        return GroupedOpenApi.builder()
                .group("categories")
                .pathsToMatch("/api/categories/**")
                .build();
    }

    @Bean
    public GroupedOpenApi tradePostsApi() {
        return GroupedOpenApi.builder()
                .group("trade-posts")
                .pathsToMatch("/api/trade-posts/**")
                .build();
    }

    @Bean
    public GroupedOpenApi meApi() {
        return GroupedOpenApi.builder()
                .group("me")
                .pathsToMatch("/api/me/**")
                .build();
    }

    @Bean
    public GroupedOpenApi tradeRequestsApi() {
        return GroupedOpenApi.builder()
                .group("trade-requests")
                .pathsToMatch("/api/trade-requests/**")
                .build();
    }
}
