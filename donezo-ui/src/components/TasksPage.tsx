import React, { useState } from 'react';
import Box from '@mui/material/Box';
import QuickNote from '../components/QuickNote/QuickNote';
import TaskList from '../components/TaskList/TaskList';
import TaskEditorDialog from './TaskEditorDialog/TaskEditorDialog';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types/Task';

const TasksPage: React.FC = () => {
  const { tasks, loading, addTask, togglePin, deleteTask, updateTask } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        py: 4,
        pb: 10,
        minHeight: '100vh',
        bgcolor: '#f6f5f2',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <QuickNote onAdd={addTask} />
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>Loading tasks...</Box>
        ) : tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            onTogglePin={togglePin}
            onDelete={deleteTask}
            onOpenTask={(t: Task) => setActiveTask(t)}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            No tasks yet. Use the note field above to start your first one!
          </Box>
        )}
      </Box>

      <TaskEditorDialog
        open={Boolean(activeTask)}
        task={activeTask}
        onClose={() => setActiveTask(null)}
        onSave={async (id, payload) => {
          await updateTask(id, payload);
          setActiveTask(null);
        }}
        onDelete={async (id) => {
          await deleteTask(id);
        }}
      />
    </Box>
  );
};

export default TasksPage;
