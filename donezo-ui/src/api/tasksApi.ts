import axios from 'axios';
import { Task } from '../types/Task';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getAllTasks = async (): Promise<Task[]> => {
  const res = await axios.get<Task[]>(`${API_BASE}/tasks`);
  return res.data;
};

export const createTask = async (name: string): Promise<Task> => {
  const res = await axios.post<Task>(`${API_BASE}/tasks`, { name });
  return res.data;
};

export const toggleTask = async (id: number): Promise<Task> => {
  const res = await axios.patch<Task>(`${API_BASE}/tasks/${id}/toggle`);
  return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/tasks/${id}`);
};