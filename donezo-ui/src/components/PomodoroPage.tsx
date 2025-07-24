import React from 'react';
import Box from '@mui/material/Box';
import Timer from './Timer/Timer';

const PomodoroPage: React.FC = () => {
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
          maxWidth: 340,
          height: 340,
          maxHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 3,
          p: 3,
          '@media (max-width:480px)': {
            height: 260,
            maxWidth: '96vw',
            p: 1.5,
          },
        }}
      >
        <Timer />
      </Box>
    </Box>
  );
};

export default PomodoroPage; 