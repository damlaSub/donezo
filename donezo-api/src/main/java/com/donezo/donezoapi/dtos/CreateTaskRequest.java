package com.donezo.donezoapi.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTaskRequest(
        @NotBlank
        @Size(min = 2, max = 100)
        String name) { }
