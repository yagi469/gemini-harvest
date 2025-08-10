package com.example.harvestapp.controller;

import com.example.harvestapp.model.Harvest;
import com.example.harvestapp.repository.HarvestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/harvests")
@CrossOrigin(origins = { "https://gemini-harvest.vercel.app", "http://localhost:3000" }, allowedHeaders = "*")
public class HarvestController {

    @Autowired
    private HarvestRepository harvestRepository;

    @GetMapping
    public List<Harvest> getAllHarvests(@RequestParam(required = false) String searchTerm) {
        if (searchTerm != null && !searchTerm.isEmpty()) {
            return harvestRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchTerm, searchTerm, searchTerm);
        } else {
            return harvestRepository.findAll();
        }
    }

    @GetMapping("/{id}")
    public Harvest getHarvestById(@PathVariable Long id) {
        return harvestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Harvest not found with id: " + id));
    }
}
