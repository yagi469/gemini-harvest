package com.example.harvestapp.config;

import com.example.harvestapp.model.Harvest;
import com.example.harvestapp.repository.HarvestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DataInitializer {

    // @Bean // Commented out to prevent data insertion on every startup
    // CommandLineRunner initDatabase(HarvestRepository harvestRepository) {
    //     return args -> {
    //         // Example available dates for some harvests
    //         Map<LocalDate, Integer> ichigoSlots = new HashMap<>();
    //         ichigoSlots.put(LocalDate.of(2025, 9, 1), 10);
    //         ichigoSlots.put(LocalDate.of(2025, 9, 8), 8);
    //         ichigoSlots.put(LocalDate.of(2025, 9, 15), 12);

    //         Map<LocalDate, Integer> budouSlots = new HashMap<>();
    //         budouSlots.put(LocalDate.of(2025, 10, 5), 15);
    //         budouSlots.put(LocalDate.of(2025, 10, 12), 10);

    //         harvestRepository.save(new Harvest("いちご狩り", "甘くて新鮮ないちごを自分で摘み取ろう！", "静岡県", 1500.0, "/images/ichigo.svg", ichigoSlots));
    //         harvestRepository.save(new Harvest("ぶどう狩り", "様々な種類のぶどうを食べ比べ！", "山梨県", 2000.0, "/images/budou.svg", budouSlots));
    //         harvestRepository.save(new Harvest("みかん狩り", "家族みんなで楽しめるみかん狩り体験", "和歌山県", 1000.0, "/images/mikan.svg", new HashMap<>()));
    //         harvestRepository.save(new Harvest("りんご狩り", "シャキシャキのりんごを収穫！", "長野県", 1800.0, "/images/ringo.svg", new HashMap<>()));
    //         harvestRepository
    //                 .save(new Harvest("さくらんぼ狩り", "初夏の味覚、真っ赤なさくらんぼを堪能！", "山形県", 2500.0, "/images/sakuranbo.svg", new HashMap<>()));
    //         harvestRepository.save(new Harvest("トマト収穫体験", "もぎたて新鮮なトマトを味わおう！", "熊本県", 1200.0, "/images/tomato.svg", new HashMap<>()));
    //         harvestRepository
    //                 .save(new Harvest("ブルーベリー摘み", "目に良いブルーベリーをたくさん摘もう！", "北海道", 1700.0, "/images/blueberry.svg", new HashMap<>()));
    //     };
    // }
}
