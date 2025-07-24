import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TaskList from './TaskList/TaskList';

const NotesPage: React.FC = () => {
  return (
    <Box sx={{ p: 2, pb: 8, minHeight: '100vh', bgcolor: 'background.default' }}>
      <h2 style={{ marginBottom: '16px' }}>Notes</h2>
      <TaskList tasks={[]} onToggle={function (id: number): void {
        throw new Error('Function not implemented.');
      } } onDelete={function (id: number): void {
        throw new Error('Function not implemented.');
      } } />
      <Fab
        color="secondary"
        aria-label="Add note"
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

export default NotesPage; 