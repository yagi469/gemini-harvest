package com.example.harvestapp.repository;

import com.example.harvestapp.model.Harvest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HarvestRepository extends JpaRepository<Harvest, Long> {
    List<Harvest> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String location, String description);
}
