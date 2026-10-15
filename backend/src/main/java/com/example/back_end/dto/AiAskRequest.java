package com.example.back_end.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiAskRequest {

    @NotBlank(message = "Question cannot be blank")
    private String question;
}
