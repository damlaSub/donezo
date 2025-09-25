import React, { useState } from 'react';
import { Box, TextField, Button, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface AddTaskPageProps {
  onBack: () => void;
  onAdd: (name: string) => Promise<void>;
  task?: import('../types/Task').Task;
  onUpdate?: (id: number, name: string) => Promise<void>;
}

const AddTaskPage: React.FC<AddTaskPageProps> = ({ onBack, onAdd, task, onUpdate }) => {
  const [value, setValue] = useState<string>(task?.name || '');

  const handleAdd = async (): Promise<void> => {
    const trimmed: string = value.trim();
    if (!trimmed) return;
    try {
      if (task && onUpdate) {
        await onUpdate(task.id, trimmed);
      } else {
        await onAdd(trimmed);
      }
      onBack();
    } catch (error: unknown) {
      console.error('Error saving task:', error);
    }
  };

  const handleBack = (): void  => {
    onBack();
  };

  return (
    <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'secondary.main' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
            {task ? 'Edit Task' : 'New Task'}
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleAdd}
            disabled={!value.trim()}
          >
            Done
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ p: 3, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        <TextField
          label="Task name"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && handleAdd()}
          fullWidth
          variant="outlined"
          multiline
          rows={20}
          autoFocus
          sx={{
            flex: 1,
            '& .MuiInputBase-root': {
              fontSize: '1.1rem',
              lineHeight: 1.5,
              height: '100%',
              alignItems: 'flex-start',
            },
            '& .MuiInputLabel-root': {
              fontSize: '1rem',
            },
            '& .MuiInputBase-inputMultiline': {
              height: '100% !important',
              paddingTop: '16px',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'secondary.main',
              },
              '&:hover fieldset': {
                borderColor: 'secondary.dark',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'secondary.main',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'secondary.main',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AddTaskPage; 