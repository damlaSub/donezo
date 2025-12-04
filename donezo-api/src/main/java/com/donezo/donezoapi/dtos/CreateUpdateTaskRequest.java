package com.donezo.donezoapi.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record CreateUpdateTaskRequest(
        @NotBlank
        @Size(min = 1, max = 255)
        String description,
        String title,
        LocalDateTime reminderAt,
        String imageUrl
) { }
