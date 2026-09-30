package com.example.back_end.controller;

import com.example.back_end.dto.UserCreateDTO;
import com.example.back_end.dto.UserDTO;
import com.example.back_end.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * Create a new user
     * POST /api/users
     * 
     */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        log.info("POST request to create user with email: {}", userCreateDTO.getEmail());
        UserDTO createdUser = userService.createUser(userCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    /**
     * Get user by ID
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        log.info("GET request to fetch user with ID: {}", id);
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Get user by email
     * GET /api/users/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        log.info("GET request to fetch user with email: {}", email);
        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    /**
     * Get all active users
     * GET /api/users
     */
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        log.info("GET request to fetch all active users");
        List<UserDTO> users = userService.getAllActiveUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Update user profile (Name, Phone, Address)
     * PUT /api/users/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO profileDTO) {
        log.info("PUT request to update user profile: {}", profileDTO.getEmail());
        UserDTO updated = userService.updateUserProfile(
                profileDTO.getEmail(),
                profileDTO.getName(),
                profileDTO.getPhone(),
                profileDTO.getAddress()
        );
        return ResponseEntity.ok(updated);
    }

    /**
     * Update user
     * PUT /api/users/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserCreateDTO userCreateDTO) {
        log.info("PUT request to update user with ID: {}", id);
        UserDTO updatedUser = userService.updateUser(id, userCreateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Delete user
     * DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("DELETE request to delete user with ID: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Deactivate user
     * PATCH /api/users/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<UserDTO> deactivateUser(@PathVariable Long id) {
        log.info("PATCH request to deactivate user with ID: {}", id);
        UserDTO deactivatedUser = userService.deactivateUser(id);
        return ResponseEntity.ok(deactivatedUser);
    }
}
