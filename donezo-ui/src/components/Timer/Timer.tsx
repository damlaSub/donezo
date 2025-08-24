import React, { useState, useRef } from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';
import alarmSound from '../../assets/alarm.mp3';
import buttonSound from '../../assets/buttonSound.mp3';

interface TimerProps {
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
}

const Timer: React.FC<TimerProps> = ({ mode }) => {
  const getInitialTime = () => {
    switch (mode) {
      case 'pomodoro':
        return 25 * 60; // 25 minutes
      case 'shortBreak':
        return 5 * 60; // 5 minutes
      case 'longBreak':
        return 15 * 60; // 15 minutes
      default:
        return 25 * 60;
    }
  };

  const getButtonColor = () => {
    return mode === 'pomodoro' ? 'error' : 'primary';
  };

  const [seconds, setSeconds] = useState(getInitialTime());
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonAudioRef = useRef<HTMLAudioElement | null>(null);

  // Reset timer when mode changes
  React.useEffect(() => {
    setSeconds(getInitialTime());
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [mode]);

  const stopAllAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.pause) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        // Handle AudioBufferSourceNode
        (audioRef.current as any).stop();
      }
    }
    if (buttonAudioRef.current) {
      if (buttonAudioRef.current.pause) {
        buttonAudioRef.current.pause();
        buttonAudioRef.current.currentTime = 0;
      } else {
        // Handle AudioBufferSourceNode
        (buttonAudioRef.current as any).stop();
      }
    }
  };

  const playAlarmSound = () => {
    stopAllAudio();
    audioRef.current = new Audio(alarmSound);
    audioRef.current.play();
  };

  const playButtonSound = () => {
    stopAllAudio();
    
    //  trim the audio context 
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    fetch(buttonSound)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const trimmedLength = Math.min(1 * audioContext.sampleRate, audioBuffer.length);
        const trimmedBuffer = audioContext.createBuffer(
          audioBuffer.numberOfChannels,
          trimmedLength,
          audioContext.sampleRate
        );
        
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
          const channelData = audioBuffer.getChannelData(channel);
          const trimmedData = trimmedBuffer.getChannelData(channel);
          for (let i = 0; i < trimmedLength; i++) {
            trimmedData[i] = channelData[i];
          }
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = trimmedBuffer;
        source.connect(audioContext.destination);
        source.start();
        
        buttonAudioRef.current = source as any;
      })
      .catch(error => {
        console.error('Error playing button sound:', error);
        // fallback to regular audio if trimming fails
        buttonAudioRef.current = new Audio(buttonSound);
        buttonAudioRef.current.play();
      });
  };

  const start = () => {
    if (!running) {
      playButtonSound();
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            playAlarmSound();
            return getInitialTime();
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pause = () => {
    playButtonSound();
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSeconds(getInitialTime());
  };

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <Paper sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: 'background.paper' }}>
      <Typography variant="h2" color="textPrimary">{minutes}:{secs}</Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button variant="contained" color={getButtonColor()} onClick={start} disabled={running}>Start</Button>
        <Button variant="outlined" color={getButtonColor()} onClick={pause} disabled={!running}>Pause</Button>
        <Button variant="outlined" color={getButtonColor()} onClick={reset}>Reset</Button>
      </Stack>
    </Paper>
  );
};

export default Timer;