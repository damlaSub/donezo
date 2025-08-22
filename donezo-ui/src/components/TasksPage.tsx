import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TaskList from './TaskList/TaskList';
import AddTaskPage from './AddTaskPage';
import { Task } from '../types/Task';
import { getAllTasks, createTask, toggleTask, deleteTask } from '../api/tasksApi';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (name: string) => {
    try {
      const newTask = await createTask(name);
           
      // Add the new task to local state
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks, newTask];
        return updatedTasks;
      });
      
      setShowAddTask(false);
    } catch (error: any) {
      console.error('Failed to create task:', error);
      alert(`Failed to create task: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      const updatedTask = await toggleTask(id);
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleBack = () => {
    setShowAddTask(false);
  };

  if (showAddTask) {
    return <AddTaskPage onBack={handleBack} onAdd={handleAddTask} />;
  }

  // Main tasks page
  return (
    <Box sx={{ p: 2, pb: 8, minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>Loading tasks...</Box>
      ) : tasks.length > 0 ? (
        <TaskList 
          tasks={tasks} 
          onToggle={handleToggleTask} 
          onDelete={handleDeleteTask} 
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 4, color: '#aaa' }}>
          No tasks yet. Click the + button to add your first task!
        </Box>
      )}
      
      <Fab
        color="secondary"
        aria-label="Add task"
        onClick={() => setShowAddTask(true)}
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 80,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default TasksPage; 