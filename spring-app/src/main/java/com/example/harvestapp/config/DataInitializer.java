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
            harvestRepository.save(new Harvest("いちご狩り", "甘くて新鮮ないちごを自分で摘み取ろう！", "静岡県", 1500.0, "/images/ichigo.svg"));
            harvestRepository.save(new Harvest("ぶどう狩り", "様々な種類のぶどうを食べ比べ！", "山梨県", 2000.0, "/images/budou.svg"));
            harvestRepository.save(new Harvest("みかん狩り", "家族みんなで楽しめるみかん狩り体験", "和歌山県", 1000.0, "/images/mikan.svg"));
            harvestRepository.save(new Harvest("りんご狩り", "シャキシャキのりんごを収穫！", "長野県", 1800.0, "/images/ringo.svg"));
            harvestRepository
                    .save(new Harvest("さくらんぼ狩り", "初夏の味覚、真っ赤なさくらんぼを堪能！", "山形県", 2500.0, "/images/sakuranbo.svg"));
            harvestRepository.save(new Harvest("トマト収穫体験", "もぎたて新鮮なトマトを味わおう！", "熊本県", 1200.0, "/images/tomato.svg"));
            harvestRepository
                    .save(new Harvest("ブルーベリー摘み", "目に良いブルーベリーをたくさん摘もう！", "北海道", 1700.0, "/images/blueberry.svg"));
        };
    }
}
