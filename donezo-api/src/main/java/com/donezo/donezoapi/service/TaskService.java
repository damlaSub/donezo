package com.donezo.donezoapi.service;

import com.donezo.donezoapi.dtos.TaskResponse;
import com.donezo.donezoapi.entites.Task;

import java.util.List;

public interface TaskService {


    List<TaskResponse> getAllTasks();

    TaskResponse createTask(String name);

    void toggleTask(Long id);

    void deleteTask(Long id);
}
