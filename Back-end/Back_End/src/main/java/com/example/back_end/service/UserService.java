package com.example.back_end.service;

import com.example.back_end.dto.AuthResponseDTO;
import com.example.back_end.dto.LoginRequestDTO;
import com.example.back_end.dto.UserCreateDTO;
import com.example.back_end.dto.UserDTO;
import com.example.back_end.entity.User;
import com.example.back_end.exception.ResourceNotFoundException;
import com.example.back_end.exception.DuplicateResourceException;
import com.example.back_end.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Create a new user
     */
    @Transactional
    public UserDTO createUser(UserCreateDTO userCreateDTO) {
        log.info("Creating user with email: {}", userCreateDTO.getEmail());

        if (userRepository.existsByEmail(userCreateDTO.getEmail())) {
            log.warn("User already exists with email: {}", userCreateDTO.getEmail());
            throw new DuplicateResourceException("User with email " + userCreateDTO.getEmail() + " already exists");
        }

        User user = new User();
        user.setName(userCreateDTO.getName());
        user.setEmail(userCreateDTO.getEmail());
        user.setPhone(userCreateDTO.getPhone());
        user.setPassword(passwordEncoder.encode(userCreateDTO.getPassword()));
        user.setIsActive(false);
        user.setIsEmailVerified(false);
        user.setIsPhoneVerified(false);

        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());
        return convertToDTO(savedUser);
    }

    /**
     * Validate credentials (email & password) before sending OTP
     */
    public UserDTO validateCredentials(LoginRequestDTO loginRequestDTO) {
        log.info("Validating credentials for email: {}", loginRequestDTO.getEmail());
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            log.warn("Authentication failed for email: {}", loginRequestDTO.getEmail());
            throw new IllegalArgumentException("Invalid email or password");
        }

        return convertToDTO(user);
    }

    /**
     * Authenticate user credentials
     */
    public AuthResponseDTO authenticate(LoginRequestDTO loginRequestDTO) {
        log.info("Authenticating user with email: {}", loginRequestDTO.getEmail());
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            log.warn("Authentication failed for email: {}", loginRequestDTO.getEmail());
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            user.setIsActive(true);
            userRepository.save(user);
        }

        String token = "bearer-token-" + user.getId() + "-" + System.currentTimeMillis();
        return new AuthResponseDTO(token, convertToDTO(user));
    }

    public AuthResponseDTO authenticateAfterOtp(String email) {
        log.info("Authenticating after OTP for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email"));

        user.setIsActive(true);
        user.setIsEmailVerified(true);
        user.setIsPhoneVerified(true);
        userRepository.save(user);

        String token = "bearer-token-" + user.getId() + "-" + System.currentTimeMillis();
        return new AuthResponseDTO(token, convertToDTO(user));
    }

    /**
     * Get user by ID
     */
    public UserDTO getUserById(Long id) {
        log.info("Fetching user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new ResourceNotFoundException("User not found with ID: " + id);
                });
        return convertToDTO(user);
    }

    /**
     * Get user by email
     */
    public UserDTO getUserByEmail(String email) {
        log.info("Fetching user with email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found with email: {}", email);
                    return new ResourceNotFoundException("User not found with email: " + email);
                });
        return convertToDTO(user);
    }

    /**
     * Get all active users
     */
    public List<UserDTO> getAllActiveUsers() {
        log.info("Fetching all active users");
        return userRepository.findAllActiveUsers()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update user
     */
    @Transactional
    public UserDTO updateUser(Long id, UserCreateDTO userCreateDTO) {
        log.info("Updating user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new ResourceNotFoundException("User not found with ID: " + id);
                });

        if (!user.getEmail().equals(userCreateDTO.getEmail()) && 
            userRepository.existsByEmail(userCreateDTO.getEmail())) {
            log.warn("User already exists with email: {}", userCreateDTO.getEmail());
            throw new DuplicateResourceException("User with email " + userCreateDTO.getEmail() + " already exists");
        }

        user.setName(userCreateDTO.getName());
        user.setEmail(userCreateDTO.getEmail());
        if (userCreateDTO.getPassword() != null && !userCreateDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userCreateDTO.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        log.info("User updated successfully with ID: {}", id);
        return convertToDTO(updatedUser);
    }

    /**
     * Delete user by ID
     */
    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new ResourceNotFoundException("User not found with ID: " + id);
                });

        userRepository.delete(user);
        log.info("User deleted successfully with ID: {}", id);
    }

    /**
     * Deactivate user
     */
    @Transactional
    public UserDTO deactivateUser(Long id) {
        log.info("Deactivating user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new ResourceNotFoundException("User not found with ID: " + id);
                });

        user.setIsActive(false);
        User updatedUser = userRepository.save(user);
        log.info("User deactivated successfully with ID: {}", id);
        return convertToDTO(updatedUser);
    }

    /**
     * Get all users (Active and Inactive)
     */
    public List<UserDTO> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Toggle active/inactive user status
     */
    @Transactional
    public UserDTO toggleUserStatus(Long id) {
        log.info("Toggling status for user ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        User updated = userRepository.save(user);
        return convertToDTO(updated);
    }

    /**
     * Convert User entity to UserDTO
     */
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getIsEmailVerified(),
                user.getIsPhoneVerified(),
                user.getIsActive(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
