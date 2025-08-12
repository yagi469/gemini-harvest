package com.example.harvestapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class HarvestAppApplication {

	public static void main(String[] args) {
		if (System.getenv("RENDER") != null) {
			// Render 環境では何もせずに環境変数から読む
		} else {
			// ローカルでは .env.local を読む
			Dotenv.configure().filename(".env.local").systemProperties().load();
		}
		SpringApplication.run(HarvestAppApplication.class, args);
	}

}
