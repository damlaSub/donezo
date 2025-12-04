package com.donezo.donezoapi.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "tasks", schema = "donezo_schema")
public class Task extends BaseEntity{
    @Column(name = "description")
    private String description;
    private boolean completed = false;
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @Column(name = "title")
    private String title;
    @Column(name = "pinned", nullable = false)
    private boolean pinned;
    @Column(name = "reminder_at")
    private LocalDateTime reminderAt;
    @Column(name = "image_url")
    private String imageUrl;

    public Task(String description){}
}
