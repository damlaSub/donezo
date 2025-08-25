package com.donezo.donezoapi.service;

import com.donezo.donezoapi.dtos.TaskResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public interface TaskService {


    List<TaskResponse> getAllTasks();

    TaskResponse createTask(String name);

    TaskResponse toggleTask(Long id);

    void deleteTask(Long id);

    TaskResponse updateTask(Long id, String name);

    TaskResponse getTaskById(Long id);
}
