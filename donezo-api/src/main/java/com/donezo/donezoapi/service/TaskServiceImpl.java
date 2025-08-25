package com.donezo.donezoapi.service;

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

        public TaskResponse createTask(String name) {
            Task task = new Task();
            task.setName(name);
            task.setCreatedAt(LocalDateTime.now());
            Task saved = repo.save(task);
            return buildTaskResponse(saved);
        }

        public TaskResponse toggleTask(Long id) {
            Task task = repo.findById(id).orElseThrow();
            task.setCompleted(!task.isCompleted());
            task.setUpdatedAt(LocalDateTime.now());
             Task saved = repo.save(task);
             return buildTaskResponse(saved);
        }

        public void deleteTask(Long id) {
            repo.deleteById(id);
        }

    @Override
    public TaskResponse updateTask(Long id, String name) {
        Task task = repo.findById(id).orElseThrow();
        task.setName(name);
        task.setUpdatedAt(LocalDateTime.now());
        Task saved = repo.save(task);
        return buildTaskResponse(saved);
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        Task task = repo.findById(id).orElseThrow();
        return buildTaskResponse(task);
    }

    protected TaskResponse buildTaskResponse(Task task) {
            return new TaskResponse(task.getId(), task.getName(), task.isCompleted(), task.getCreatedAt(), task.getUpdatedAt());
        }
}
