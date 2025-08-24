import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Timer from './Timer/Timer';

const PomodoroPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');

  const getButtonColor = (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    return mode === 'pomodoro' ? 'error' : 'primary';
  };

  const modeConfig = [
    { key: 'pomodoro', label: 'Pomodoro' },
    { key: 'shortBreak', label: 'Short Break' },
    { key: 'longBreak', label: 'Long Break' }
  ] as const;

  const renderButton = (modeKey: typeof modeConfig[number]['key'], label: string) => {
    const isActive = activeMode === modeKey;
    const color = getButtonColor(activeMode);
    
    return (
      <Button 
        key={modeKey}
        variant={isActive ? 'contained' : 'outlined'}
        color={color}
        onClick={() => setActiveMode(modeKey)}
        sx={{
          ...(isActive ? {} : {
            borderColor: color === 'error' ? '#f44336' : '#2196f3',
            color: color === 'error' ? '#f44336' : '#2196f3',
            '&:hover': {
              borderColor: color === 'error' ? '#d32f2f' : '#1976d2',
              color: color === 'error' ? '#d32f2f' : '#1976d2',
              bgcolor: color === 'error' ? 'rgba(244, 67, 54, 0.04)' : 'rgba(33, 150, 243, 0.04)'
            }
          })
        }}
      >
        {label}
      </Button>
    );
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
    >
      <Box
        sx={{
          width: '90vw',
          maxWidth: 500,
          height: 400,
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 3,
          p: 3,
          gap: 2,
          '@media (max-width:480px)': {
            height: 320,
            maxWidth: '96vw',
            p: 1.5,
          },
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          {modeConfig.map(({ key, label }) => renderButton(key, label))}
        </Stack>
        <Timer mode={activeMode} />
      </Box>
    </Box>
  );
};

export default PomodoroPage;