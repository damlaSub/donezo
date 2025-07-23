import React, { useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';

const INITIAL_TIME = 25 * 60; // 25 minutes in seconds

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(INITIAL_TIME);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            alert('Time is up!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pause = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSeconds(INITIAL_TIME);
  };

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h2">{minutes}:{secs}</Typography>
      <Box mt={2} display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" onClick={start} disabled={running}>Start</Button>
        <Button variant="outlined" onClick={pause} disabled={!running}>Pause</Button>
        <Button variant="text" onClick={reset}>Reset</Button>
      </Box>
    </Box>
  );
};

export default Timer;
