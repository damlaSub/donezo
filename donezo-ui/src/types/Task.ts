export interface Task {
  id: number;
  title?: string | null;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  pinned?: boolean;
  reminderAt?: string | null;
  imageUrl?: string | null;
}
