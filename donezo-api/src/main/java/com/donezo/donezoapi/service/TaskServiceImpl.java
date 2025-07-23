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
                    .map(task -> new TaskResponse(task.getId(), task.getName(), task.isCompleted(), task.getCreatedAt())).toList();
        }

        public void createTask(String name) {
            Task task = new Task();
            task.setName(name);
            task.setCreatedAt(LocalDateTime.now());
            repo.save(task);
        }

        public void toggleTask(Long id) {
            Task task = repo.findById(id).orElseThrow();
            task.setCompleted(!task.isCompleted());
             repo.save(task);
        }

        public void deleteTask(Long id) {
            repo.deleteById(id);
        }
}
