package com.donezo.donezoapi.controllers;

import com.donezo.donezoapi.dtos.CreateTaskRequest;
import com.donezo.donezoapi.dtos.TaskResponse;
import com.donezo.donezoapi.repositories.TaskRepository;
import com.donezo.donezoapi.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public List<TaskResponse> getTasks() {
        return service.getAllTasks();
    }

    @PostMapping
    @ResponseStatus
    public TaskResponse create(@Valid @RequestBody CreateTaskRequest request) {
         return service.createTask(request.name());
    }

    @PatchMapping("/{id}/toggle")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void toggle(@PathVariable Long id) {
         service.toggleTask(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteTask(id);
    }
}
