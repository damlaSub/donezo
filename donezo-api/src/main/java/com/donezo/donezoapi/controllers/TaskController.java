package com.donezo.donezoapi.controllers;

import com.donezo.donezoapi.dtos.CreateUpdateTaskRequest;
import com.donezo.donezoapi.dtos.TaskResponse;
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

    @GetMapping("/{id}")
    public TaskResponse getTaskForUpdate(@PathVariable Long id) {
        return service.getTaskById(id);
    }

    @PostMapping
    public TaskResponse create(@Valid @RequestBody CreateUpdateTaskRequest request) {
         return service.createTask(request.name());
    }

    @PatchMapping("/{id}")
    public TaskResponse update(@PathVariable Long id,
                               @Valid
                               @RequestBody CreateUpdateTaskRequest request) {
        return service.updateTask(id, request.name());
    }


    @PatchMapping("/{id}/toggle")
    public TaskResponse toggle(@PathVariable Long id) {
         return service.toggleTask(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteTask(id);
    }
}
