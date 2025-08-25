package com.donezo.donezoapi.dtos;

import java.time.LocalDateTime;

public record TaskResponse(Long id, String name, boolean completed, LocalDateTime createdAt, LocalDateTime updatedAt) {
}
