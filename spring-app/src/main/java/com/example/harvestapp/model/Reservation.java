package com.example.harvestapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;

@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long harvestId;
    private String userName;
    private String userEmail;
    private LocalDate reservationDate;
    private int numberOfParticipants;
    private String status; // e.g., "Pending", "Confirmed", "Cancelled"

    public Reservation() {
    }

    public Reservation(Long harvestId, String userName, String userEmail, LocalDate reservationDate, int numberOfParticipants, String status) {
        this.harvestId = harvestId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.reservationDate = reservationDate;
        this.numberOfParticipants = numberOfParticipants;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHarvestId() {
        return harvestId;
    }

    public void setHarvestId(Long harvestId) {
        this.harvestId = harvestId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public LocalDate getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDate reservationDate) {
        this.reservationDate = reservationDate;
    }

    public int getNumberOfParticipants() {
        return numberOfParticipants;
    }

    public void setNumberOfParticipants(int numberOfParticipants) {
        this.numberOfParticipants = numberOfParticipants;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
