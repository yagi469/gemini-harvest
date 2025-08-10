package com.example.harvestapp.config;

import com.example.harvestapp.model.Harvest;
import com.example.harvestapp.repository.HarvestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(HarvestRepository harvestRepository) {
        return args -> {
            harvestRepository.save(new Harvest("いちご狩り", "甘くて新鮮ないちごを自分で摘み取ろう！", "静岡県", 1500.0));
            harvestRepository.save(new Harvest("ぶどう狩り", "様々な種類のぶどうを食べ比べ！", "山梨県", 2000.0));
            harvestRepository.save(new Harvest("みかん狩り", "家族みんなで楽しめるみかん狩り体験", "和歌山県", 1000.0));
        };
    }
}
