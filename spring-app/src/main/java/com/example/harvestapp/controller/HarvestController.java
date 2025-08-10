package com.example.harvestapp.controller;

import com.example.harvestapp.model.Harvest;
import com.example.harvestapp.repository.HarvestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/harvests")
@CrossOrigin(origins = { 
        "https://gemini-harvest.vercel.app",
        "https://gemini-harvest.onrender.com",
        "http://localhost:3000" 
    }, 
    allowedHeaders = "*", 
    methods = {
        org.springframework.web.bind.annotation.RequestMethod.GET,
        org.springframework.web.bind.annotation.RequestMethod.POST,
        org.springframework.web.bind.annotation.RequestMethod.PUT,
        org.springframework.web.bind.annotation.RequestMethod.DELETE,
        org.springframework.web.bind.annotation.RequestMethod.OPTIONS 
    })
public class HarvestController {

    @Autowired
    private HarvestRepository harvestRepository;

    @GetMapping
    public List<Harvest> getAllHarvests() {
        return harvestRepository.findAll();
    }

    @GetMapping("/{id}")
    public Harvest getHarvestById(@PathVariable Long id) {
        return harvestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Harvest not found with id: " + id));
    }
}
