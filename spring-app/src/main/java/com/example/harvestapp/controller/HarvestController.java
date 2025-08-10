package com.example.harvestapp.controller;

import com.example.harvestapp.model.Harvest;
import com.example.harvestapp.repository.HarvestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/harvests")
@CrossOrigin(origins = "http://localhost:3000")
public class HarvestController {

    @Autowired
    private HarvestRepository harvestRepository;

    @GetMapping
    public List<Harvest> getAllHarvests() {
        return harvestRepository.findAll();
    }
}
