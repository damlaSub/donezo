import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TaskList from './TaskList/TaskList';
import AddTaskPage from './AddTaskPage';
import { Task } from '../types/Task';
import { getAllTasks, createTask, toggleTask, deleteTask, updateTaskName } from '../api/tasksApi';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (): Promise<void> => {
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

  const handleAddTask = async (name: string): Promise<void> => {
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

  const handleToggleTask = async (id: number): Promise<void> => {
    try {
      const updatedTask = await toggleTask(id);
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (id: number): Promise<void> => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleBack = (): void => {
    setShowAddTask(false);
    setSelectedTaskId(null);
  };

  const handleSelectTask = (id: number): void => {
    setSelectedTaskId(id);
    setShowAddTask(true);
  };

  const handleUpdateTask = async (id: number, name: string): Promise<void> => {
    try {
      const updated = await updateTaskName(id, name);
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  if (showAddTask) {
    const selectedTask: Task | undefined = tasks.find(t => t.id === selectedTaskId) || undefined;
    return <AddTaskPage onBack={handleBack} onAdd={handleAddTask} task={selectedTask} onUpdate={handleUpdateTask} />;
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
          selectedTaskId={selectedTaskId}
          onSelect={handleSelectTask}
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