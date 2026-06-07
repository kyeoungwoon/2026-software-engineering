package com.example.swebook.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
public class SqliteDataSourceConfig {

    private static final String SQLITE_DRIVER_CLASS_NAME = "org.sqlite.JDBC";
    private static final String SQLITE_URL_PREFIX = "jdbc:sqlite:";
    private static final String DEFAULT_DATABASE_PATH = "data/swebook.sqlite";
    private static final String PROJECT_DATABASE_PATH = "Backend/swebook/data/swebook.sqlite";

    @Bean
    public DataSource dataSource(Environment environment) {
        String configuredUrl = environment.getProperty("spring.datasource.url");
        if (hasText(configuredUrl)) {
            return createDataSource(configuredUrl);
        }

        String configuredPath = environment.getProperty("SWEBOOK_DB_PATH");
        Path databasePath = hasText(configuredPath)
                ? Path.of(configuredPath).toAbsolutePath().normalize()
                : resolveDefaultDatabasePath();

        return createDataSource(SQLITE_URL_PREFIX + databasePath);
    }

    private DataSource createDataSource(String url) {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(SQLITE_DRIVER_CLASS_NAME);
        dataSource.setUrl(url);
        return dataSource;
    }

    private Path resolveDefaultDatabasePath() {
        Path current = Path.of("").toAbsolutePath().normalize();
        while (current != null) {
            Path directCandidate = current.resolve(DEFAULT_DATABASE_PATH).normalize();
            if (Files.exists(directCandidate)) {
                return directCandidate;
            }

            Path projectCandidate = current.resolve(PROJECT_DATABASE_PATH).normalize();
            if (Files.exists(projectCandidate)) {
                return projectCandidate;
            }

            current = current.getParent();
        }

        return Path.of(PROJECT_DATABASE_PATH).toAbsolutePath().normalize();
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
