package com.example.harvestapp.controller;

import com.example.harvestapp.model.Harvest;
import com.example.harvestapp.repository.HarvestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/harvests")
@CrossOrigin(origins = { "https://gemini-harvest.vercel.app", "https://gemini-harvest.onrender.com",
        "http://localhost:3000" }, allowedHeaders = "*")
public class HarvestController {

    @Autowired
    private HarvestRepository harvestRepository;

            @GetMapping
    public List<Harvest> getAllHarvests(@RequestParam(required = false) String searchTerm) {
        if (searchTerm != null && !searchTerm.isEmpty()) {
            return harvestRepository
                    .findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                            searchTerm, searchTerm, searchTerm);
        } else {
            return harvestRepository.findAll();
        }
    }

    @GetMapping("/{id}")
    public Harvest getHarvestById(@PathVariable Long id) {
        return harvestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Harvest not found with id: " + id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Harvest> updateHarvest(@PathVariable Long id, @RequestBody Harvest harvestDetails) {
        Harvest harvest = harvestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Harvest not found with id: " + id));

        harvest.setName(harvestDetails.getName());
        harvest.setDescription(harvestDetails.getDescription());
        harvest.setLocation(harvestDetails.getLocation());
        harvest.setPrice(harvestDetails.getPrice());
        harvest.setImageData(harvestDetails.getImageData());
        harvest.setAvailableDates(harvestDetails.getAvailableDates());

        Harvest updatedHarvest = harvestRepository.save(harvest);
        return ResponseEntity.ok(updatedHarvest);
    }
}

