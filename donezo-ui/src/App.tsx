import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import TaskInput from './components/TaskInput/TaskInput';
import TaskList from './components/TaskList/TaskList';
import Timer from './components/Timer/Timer';
import { Task } from './types/Task';
import * as tasksApi from './api/tasksApi';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks on mount
  useEffect(() => {
    tasksApi.getAllTasks().then(setTasks);
  }, []);

  const handleAddTask = async (name: string) => {
    const newTask = await tasksApi.createTask(name);
    setTasks(prev => [...prev, newTask]);
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    const updated = await tasksApi.toggleTask(id, completed );
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
  };

  const handleDeleteTask = async (id: number) => {
    await tasksApi.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Focus Timer & Task List
        </Typography>
        <TaskInput onAdd={handleAddTask} />
        <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
        <Timer />
      </Paper>
    </Container>
  );
};

export default App;
