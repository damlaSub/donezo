package com.donezo.donezoapi.service;

import com.donezo.donezoapi.dtos.CreateUpdateTaskRequest;
import com.donezo.donezoapi.dtos.TaskResponse;

import java.util.List;

public interface TaskService {


    List<TaskResponse> getAllTasks();

    TaskResponse createTask(CreateUpdateTaskRequest request);

    TaskResponse togglePin(Long id);

    void deleteTask(Long id);

    TaskResponse updateTask(Long id, CreateUpdateTaskRequest request);

    TaskResponse getTaskById(Long id);
}
