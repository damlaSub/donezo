import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface TaskInputProps {
  onAdd: (description: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAdd }) => {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <Box
      display="flex"
      gap={2}
      mb={3}
      p={2}
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: 2,
        borderRadius: 2,
        alignItems: 'center',
      }}
    >
      <TextField
        label="New Task"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        fullWidth
        variant="outlined"
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleAdd}
        size="large"
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          px: 3,
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        Add
      </Button>
    </Box>
  );
};

export default TaskInput;
