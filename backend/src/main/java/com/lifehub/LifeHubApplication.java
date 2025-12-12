package com.lifehub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.lifehub.repository")
public class LifeHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(LifeHubApplication.class, args);
    }
}



