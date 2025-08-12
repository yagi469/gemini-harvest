package com.example.harvestapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
public class HarvestAppApplication {

	public static void main(String[] args) {
				Dotenv.configure().filename(".env.local").systemProperties().load(); // Load .env.local file as system properties
		SpringApplication.run(HarvestAppApplication.class, args);
	}

}

