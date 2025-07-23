import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface TaskInputProps {
  onAdd: (name: string) => void;
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
    <Box display="flex" gap={2} mb={2}>
      <TextField
        label="New Task"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        fullWidth
      />
      <Button variant="contained" onClick={handleAdd}>
        Add
      </Button>
    </Box>
  );
};

export default TaskInput;
