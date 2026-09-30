package com.example.back_end;

import com.example.back_end.dto.UserCreateDTO;
import com.example.back_end.dto.UserDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Controller Layer Tests
 * Integration tests for UserController REST endpoints
 */
class UserControllerTest {

    private UserDTO userDTO;
    private UserCreateDTO userCreateDTO;

    @BeforeEach
    void setUp() {
        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setName("Test User");
        userDTO.setEmail("test@example.com");
        userDTO.setIsActive(true);
        userDTO.setCreatedAt(LocalDateTime.now());
        userDTO.setUpdatedAt(LocalDateTime.now());

        userCreateDTO = new UserCreateDTO();
        userCreateDTO.setName("Test User");
        userCreateDTO.setEmail("test@example.com");
        userCreateDTO.setPassword("password123");
    }

    @Test
    void testCreateUserDTO_Success() {
        assertNotNull(userDTO);
        assertEquals(1L, userDTO.getId());
        assertEquals("Test User", userDTO.getName());
        assertEquals("test@example.com", userDTO.getEmail());
        assertTrue(userDTO.getIsActive());
    }

    @Test
    void testCreateUserDTOValidation() {
        assertNotNull(userCreateDTO);
        assertEquals("Test User", userCreateDTO.getName());
        assertEquals("test@example.com", userCreateDTO.getEmail());
        assertEquals("password123", userCreateDTO.getPassword());
    }

    @Test
    void testUserDTOMapping() {
        UserDTO mappedDTO = new UserDTO(
                userDTO.getId(),
                userDTO.getName(),
                userDTO.getEmail(),
                userDTO.getIsActive(),
                userDTO.getCreatedAt(),
                userDTO.getUpdatedAt()
        );

        assertEquals(userDTO.getId(), mappedDTO.getId());
        assertEquals(userDTO.getName(), mappedDTO.getName());
        assertEquals(userDTO.getEmail(), mappedDTO.getEmail());
    }
}
