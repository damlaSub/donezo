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
             Task saved = repo.save(task);
             return buildTaskResponse(saved);
        }

        public void deleteTask(Long id) {
            repo.deleteById(id);
        }

        protected TaskResponse buildTaskResponse(Task task) {
            return new TaskResponse(task.getId(), task.getName(), task.isCompleted(), task.getCreatedAt());
        }
}
