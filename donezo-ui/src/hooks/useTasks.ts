import { useCallback, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Task } from '../types/Task';
import {
  getAllTasks,
  createTask as apiCreateTask,
  togglePin as apiTogglePin,
  deleteTask as apiDeleteTask,
  updateTask as apiUpdateTask,
  CreateUpdateTaskPayload,
} from '../api/tasksApi';

type UseTasksResult = {
  tasks: Task[];
  loading: boolean;
  refresh: () => Promise<void>;
  addTask: (title: string | null, description: string) => Promise<void>;
  createTask: (payload: CreateUpdateTaskPayload) => Promise<Task | undefined>;
  updateTask: (id: number, payload: CreateUpdateTaskPayload) => Promise<Task | undefined>;
  togglePin: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
};

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const fetched = await getAllTasks();
      setTasks(fetched);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (payload: CreateUpdateTaskPayload) => {
    try {
      const created = await apiCreateTask(payload);
      setTasks((prev) => [...prev, created]);
      return created;
    } catch (error: unknown) {
      console.error('Failed to create task:', error);
      if (isAxiosError(error)) {
        alert(`Failed to create task: ${error.response?.data?.message ?? error.message}`);
      } else if (error instanceof Error) {
        alert(`Failed to create task: ${error.message}`);
      } else {
        alert('Failed to create task: Unknown error');
      }
      return undefined;
    }
  }, []);

  const addTask = useCallback(
    async (title: string | null, description: string) => {
      const payload: CreateUpdateTaskPayload = { description, title };
      await createTask(payload);
    },
    [createTask],
  );

  const updateTask = useCallback(async (id: number, payload: CreateUpdateTaskPayload) => {
    try {
      const updated = await apiUpdateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      return updated;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }, []);

  const togglePin = useCallback(async (id: number) => {
    try {
      const updated = await apiTogglePin(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      await apiDeleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, []);

  return {
    tasks,
    loading,
    refresh: fetchTasks,
    addTask,
    createTask,
    updateTask,
    togglePin,
    deleteTask,
  };
}
