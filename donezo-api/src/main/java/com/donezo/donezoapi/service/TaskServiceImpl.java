package com.donezo.donezoapi.service;

import com.donezo.donezoapi.dtos.CreateUpdateTaskRequest;
import com.donezo.donezoapi.dtos.TaskResponse;
import com.donezo.donezoapi.entites.Task;
import com.donezo.donezoapi.repositories.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {


        private final TaskRepository repo;

        public TaskServiceImpl(TaskRepository repo) {
            this.repo = repo;
        }

        public List<TaskResponse> getAllTasks() {
            return repo.findAll().stream()
                    .map(this::buildTaskResponse).toList();
        }

        public TaskResponse createTask(CreateUpdateTaskRequest request) {
            Task task = new Task();
            task.setDescription(request.description());
            task.setCreatedAt(LocalDateTime.now());
            if (request.title() != null) {
                task.setTitle(request.title());
            }
            if (request.reminderAt() != null) {
                task.setReminderAt(request.reminderAt());
            }
            if (request.imageUrl() != null) {
                task.setImageUrl(request.imageUrl());
            }
            Task saved = repo.save(task);
            return buildTaskResponse(saved);
        }

        public TaskResponse togglePin(Long id) {
            Task task = repo.findById(id).orElseThrow();
            task.setPinned(!task.isPinned());
            task.setUpdatedAt(LocalDateTime.now());
             Task saved = repo.save(task);
             return buildTaskResponse(saved);
        }

        public void deleteTask(Long id) {
            repo.deleteById(id);
        }

    @Override
    public TaskResponse updateTask(Long id, CreateUpdateTaskRequest request) {
        Task task = repo.findById(id).orElseThrow();
        task.setDescription(request.description());
        task.setUpdatedAt(LocalDateTime.now());
        if (request.title() != null) {
            task.setTitle(request.title());
        }
        if (request.reminderAt() != null) {
            task.setReminderAt(request.reminderAt());
        }
        if (request.imageUrl() != null) {
            task.setImageUrl(request.imageUrl());
        }
        Task saved = repo.save(task);
        return buildTaskResponse(saved);
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        Task task = repo.findById(id).orElseThrow();
        return buildTaskResponse(task);
    }

    protected TaskResponse buildTaskResponse(Task task) {
            return new TaskResponse(task.getId(), task.getDescription(), task.isCompleted(), task.getCreatedAt(), task.getUpdatedAt(), task.getTitle(), task.isPinned(), task.getReminderAt(), task.getImageUrl());
        }
}
