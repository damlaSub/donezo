package com.donezo.donezoapi.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class SchemaInitializer {

    private static final Logger logger = LoggerFactory.getLogger(SchemaInitializer.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void createSchema() {
        logger.info("=== SCHEMA INITIALIZATION STARTING ===");

        try (Connection conn = dataSource.getConnection()) {
            logger.info("Database URL: {}", conn.getMetaData().getURL());

            // Create schema if not exists
            jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS donezo_schema");

            // Verify schema was created
            Boolean schemaExists = jdbcTemplate.queryForObject(
                    "SELECT EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = 'donezo_schema')",
                    Boolean.class
            );

            if (schemaExists != null && schemaExists) {
                logger.info("Schema 'donezo_schema' created successfully or already exists");
            } else {
                logger.warn("Schema 'donezo_schema' was not created, but continuing startup");
            }

        } catch (Exception e) {
            logger.error("Failed to create schema 'donezo_schema', continuing startup", e);
            // Do not throw, just log — avoids breaking Spring context
        }

        logger.info("=== SCHEMA INITIALIZATION COMPLETED ===");
    }
}
