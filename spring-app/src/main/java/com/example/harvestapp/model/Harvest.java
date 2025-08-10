package com.example.harvestapp.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import java.util.Set;

@Entity
public class Harvest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String location;
    private double price;
    private String imageData;

    @ElementCollection
    private Set<LocalDate> availableDates;

    public Harvest() {
    }

    public Harvest(String name, String description, String location, double price, String imageData, Set<LocalDate> availableDates) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.price = price;
        this.imageData = imageData;
        this.availableDates = availableDates;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImageData() {
        return imageData;
    }

    public void setImageData(String imageData) {
        this.imageData = imageData;
    }

    public Set<LocalDate> getAvailableDates() {
        return availableDates;
    }

    public void setAvailableDates(Set<LocalDate> availableDates) {
        this.availableDates = availableDates;
    }
}
