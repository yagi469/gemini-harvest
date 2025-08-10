package com.example.harvestapp.controller;

import com.example.harvestapp.model.Harvest;
import com.example.harvestapp.model.Reservation;
import com.example.harvestapp.repository.HarvestRepository;
import com.example.harvestapp.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = { "https://gemini-harvest.vercel.app", "http://localhost:3000" }, allowedHeaders = "*")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private HarvestRepository harvestRepository;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        // 1. Fetch the Harvest entity
        Optional<Harvest> optionalHarvest = harvestRepository.findById(reservation.getHarvestId());
        if (optionalHarvest.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Harvest not found with ID: " + reservation.getHarvestId());
        }
        Harvest harvest = optionalHarvest.get();

        // 2. Update availableSlots
        LocalDate reservationDate = reservation.getReservationDate();
        int requestedParticipants = reservation.getNumberOfParticipants();

        Map<LocalDate, Integer> availableSlots = harvest.getAvailableSlots();
        Integer currentSlots = availableSlots.getOrDefault(reservationDate, 0);

        if (currentSlots < requestedParticipants) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough available slots for the selected date.");
        }

        availableSlots.put(reservationDate, currentSlots - requestedParticipants);
        harvest.setAvailableSlots(availableSlots);

        // 3. Save the updated Harvest entity
        harvestRepository.save(harvest);

        // Set default status and save reservation
        reservation.setStatus("Pending"); // Default status
        Reservation savedReservation = reservationRepository.save(reservation);
        return new ResponseEntity<>(savedReservation, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() { // New method to get all reservations
        List<Reservation> reservations = reservationRepository.findAll();
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @GetMapping(params = "userId") // Specify that this mapping requires the userId parameter
    public ResponseEntity<List<Reservation>> getReservationsByUserId(@RequestParam String userId) {
        List<Reservation> reservations = reservationRepository.findByUserId(userId);
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Reservation> updateReservationStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        Optional<Reservation> optionalReservation = reservationRepository.findById(id);
        if (optionalReservation.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found with ID: " + id);
        }
        Reservation reservation = optionalReservation.get();
        String newStatus = statusUpdate.get("status");
        if (newStatus == null || (!newStatus.equals("Confirmed") && !newStatus.equals("Cancelled"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status provided. Must be 'Confirmed' or 'Cancelled'.");
        }
        reservation.setStatus(newStatus);
        Reservation updatedReservation = reservationRepository.save(reservation);
        return new ResponseEntity<>(updatedReservation, HttpStatus.OK);
    }

    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getReservationCountsByUserId(@RequestParam String userId) {
        List<Reservation> reservations = reservationRepository.findByUserId(userId);
        long confirmedCount = reservations.stream()
                .filter(reservation -> "Confirmed".equals(reservation.getStatus()))
                .count();
        long pendingCount = reservations.stream()
                .filter(reservation -> "Pending".equals(reservation.getStatus()))
                .count();

        return new ResponseEntity<>(Map.of("confirmed", confirmedCount, "pending", pendingCount), HttpStatus.OK);
    }
}
