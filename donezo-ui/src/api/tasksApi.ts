import axios from 'axios';
import { Task } from '../types/Task';

const API_BASE: string = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE,
});

export interface CreateUpdateTaskPayload {
  description: string;
  title?: string | null;
  reminderAt?: string | null;
  imageUrl?: string | null;
}

const buildTaskPayload = (payload: CreateUpdateTaskPayload): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    description: payload.description,
  };

  if (payload.title) body.title = payload.title;
  if (payload.reminderAt) body.reminderAt = payload.reminderAt;
  if (payload.imageUrl) body.imageUrl = payload.imageUrl;

  return body;
};

export const getAllTasks = async (): Promise<Task[]> => {
  const res = await apiClient.get<Task[]>('/tasks');
  return res.data;
};

export const getTaskById = async (id: number): Promise<Task> => {
  const res = await apiClient.get<Task>(`/tasks/${id}`);
  return res.data;
};

export const createTask = async (payload: CreateUpdateTaskPayload): Promise<Task> => {
  const res = await apiClient.post<Task>('/tasks', buildTaskPayload(payload));
  return res.data;
};

export const updateTask = async (
  id: number,
  payload: CreateUpdateTaskPayload,
): Promise<Task> => {
  const res = await apiClient.patch<Task>(`/tasks/${id}`, buildTaskPayload(payload));
  return res.data;
};

export const togglePin = async (id: number): Promise<Task> => {
  const res = await apiClient.patch<Task>(`/tasks/${id}/toggle`);
  return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

export const uploadImage = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append('file', file);

  const res = await apiClient.post<{ imageUrl: string }>('/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.imageUrl;
};