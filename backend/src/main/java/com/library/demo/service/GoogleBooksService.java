package com.library.demo.service;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GoogleBooksService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GoogleBooksService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String getBookCoverUrl(String title, String author) {
        try {
            String query = String.format("%s %s", title, author).replace(" ", "+");
            System.out.println("Querying Google Books API with: " + query); // Log truy vấn
            String apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + query;
            String response = restTemplate.getForObject(apiUrl, String.class);
            System.out.println("Google Books API response: " + response); // Log phản hồi

            JsonNode root = objectMapper.readTree(response);
            JsonNode items = root.path("items");
            if (items.isArray() && items.size() > 0) {
                JsonNode imageLinks = items.get(0).path("volumeInfo").path("imageLinks");
                String thumbnail = imageLinks.path("thumbnail").asText();
                if (!thumbnail.isEmpty()) {
                    return thumbnail.replace("https://", "http://").replace("zoom=1", "zoom=2");
                }
            }
            System.out.println("No image found for: " + title + ", " + author);
        } catch (Exception e) {
            System.err.println("Error fetching Google Books API: " + e.getMessage());
        }
        return null;
    }
}