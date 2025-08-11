package com.example.harvestapp.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        // 環境変数から直接データベース接続情報を取得
        String url = System.getenv("SPRING_DATASOURCE_URL");
        String username = System.getenv("SPRING_DATASOURCE_USERNAME");
        String password = System.getenv("SPRING_DATASOURCE_PASSWORD");

        // もし環境変数がなければ、起動を失敗させる（推奨）
        if (url == null || username == null || password == null) {
            throw new IllegalStateException("Database configuration is missing in environment variables.");
        }

        return DataSourceBuilder.create()
                .url(url)
                .username(username)
                .password(password)
                // PostgreSQLドライバクラス名を明示的に指定
                .driverClassName("org.postgresql.Driver") 
                .build();
    }
}
