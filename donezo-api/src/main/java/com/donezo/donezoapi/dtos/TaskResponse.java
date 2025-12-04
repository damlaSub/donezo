package com.donezo.donezoapi.dtos;

import java.time.LocalDateTime;

public record TaskResponse(Long id, String description, boolean completed, LocalDateTime createdAt, LocalDateTime updatedAt, String title, boolean pinned, LocalDateTime reminderAt, String imageUrl) {
}
