package com.example.harvestapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

        @Override
        public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                                .allowedOriginPatterns("*") // すべてのオリジンを許可
                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                                .allowedHeaders("*")
                                .exposedHeaders("*")
                                .allowCredentials(true)
                                .maxAge(3600);
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // すべてのオリジンを許可（ワイルドカード）
                configuration.setAllowedOriginPatterns(Arrays.asList("*"));

                // すべてのメソッドを許可
                configuration.setAllowedMethods(
                                Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));

                // すべてのヘッダーを許可
                configuration.setAllowedHeaders(Arrays.asList("*"));

                // すべてのヘッダーを公開
                configuration.setExposedHeaders(Arrays.asList("*"));

                // 認証情報を許可
                configuration.setAllowCredentials(true);

                // プリフライトリクエストのキャッシュ時間
                configuration.setMaxAge(3600L);

                // より柔軟な設定
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
