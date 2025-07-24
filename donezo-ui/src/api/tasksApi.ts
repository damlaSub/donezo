import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:8080/tasks'; 

export const getAllTasks = async (): Promise<Task[]> => {
  const res = await axios.get<Task[]>(API_URL);
  return res.data;
};

export const createTask = async (name: string): Promise<Task> => {
  const res = await axios.post<Task>(API_URL, { name });
  return res.data;
};

export const toggleTask = async (id: number): Promise<Task> => {
  const res = await axios.patch<Task>(`${API_URL}/${id}/toggle`);
  return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};