package com.donezo.donezoapi.service;

import com.donezo.donezoapi.dtos.TaskResponse;
import java.util.List;

public interface TaskService {


    List<TaskResponse> getAllTasks();

    TaskResponse createTask(String name);

    TaskResponse toggleTask(Long id);

    void deleteTask(Long id);
}
