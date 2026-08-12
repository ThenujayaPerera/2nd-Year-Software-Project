package com.example.back_end;

import com.example.back_end.dto.UserCreateDTO;
import com.example.back_end.dto.UserDTO;
import com.example.back_end.entity.User;
import com.example.back_end.exception.DuplicateResourceException;
import com.example.back_end.exception.ResourceNotFoundException;
import com.example.back_end.repository.UserRepository;
import com.example.back_end.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserCreateDTO userCreateDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedPassword");
        testUser.setIsActive(true);
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());

        userCreateDTO = new UserCreateDTO();
        userCreateDTO.setName("Test User");
        userCreateDTO.setEmail("test@example.com");
        userCreateDTO.setPassword("password123");
    }

    @Test
    void testCreateUser_Success() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserDTO result = userService.createUser(userCreateDTO);

        assertNotNull(result);
        assertEquals("Test User", result.getName());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateUser_DuplicateEmail() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            userService.createUser(userCreateDTO);
        });
    }

    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        UserDTO result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals("Test User", result.getName());
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(999L);
        });
    }

    @Test
    void testDeleteUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        userService.deleteUser(1L);

        verify(userRepository, times(1)).delete(testUser);
    }
}
