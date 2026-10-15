package com.example.back_end;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

@SpringBootApplication
@EnableCaching
public class BackEndApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(BackEndApplication.class, args);
    }

    private static void loadDotEnv() {
        File[] candidateFiles = new File[] {
                new File(".env"),
                new File("../.env"),
                new File("backend/.env")
        };

        for (File file : candidateFiles) {
            if (file.exists() && file.isFile()) {
                try (FileInputStream fis = new FileInputStream(file)) {
                    Properties props = new Properties();
                    props.load(fis);
                    for (String key : props.stringPropertyNames()) {
                        String value = props.getProperty(key);
                        if (System.getProperty(key) == null && System.getenv(key) == null && value != null) {
                            System.setProperty(key, value.trim());
                        }
                    }
                    break;
                } catch (IOException ignored) {
                }
            }
        }
    }
}

