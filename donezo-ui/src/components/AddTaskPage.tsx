import React, { useState } from 'react';
import { Box, TextField, Button, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface AddTaskPageProps {
  onBack: () => void;
  onAdd: (name: string) => Promise<void>;
}

const AddTaskPage: React.FC<AddTaskPageProps> = ({ onBack, onAdd }) => {
  const [value, setValue] = useState('');

  const handleAdd = async () => {
    if (value.trim()) {
      try {
        await onAdd(value.trim());
        onBack();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleBack = () => {
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
            New Task
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
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
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