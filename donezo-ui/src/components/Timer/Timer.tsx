import React, { useState, useRef } from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';
import alarmSound from '../../assets/alarm.mp3';
import buttonSound from '../../assets/buttonSound.mp3';

interface TimerProps {
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
}

const Timer: React.FC<TimerProps> = ({ mode }) => {
  const getInitialTime = React.useCallback(() => {
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
  }, [mode]);

  const getButtonColor = () => {
    return mode === 'pomodoro' ? 'error' : 'primary';
  };

  const [seconds, setSeconds] = useState(getInitialTime());
  const [running, setRunning] = useState(false);
  type AudioHandle = HTMLAudioElement | AudioBufferSourceNode;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<AudioHandle | null>(null);
  const buttonAudioRef = useRef<AudioHandle | null>(null);

  React.useEffect(() => {
    setSeconds(getInitialTime());
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [getInitialTime]);

  const stopAllAudio = () => {
    if (audioRef.current) {
      const handle = audioRef.current;
      if (handle instanceof HTMLAudioElement) {
        handle.pause();
        handle.currentTime = 0;
      } else {
        handle.stop();
      }
    }
    if (buttonAudioRef.current) {
      const handle = buttonAudioRef.current;
      if (handle instanceof HTMLAudioElement) {
        handle.pause();
        handle.currentTime = 0;
      } else {
        handle.stop();
      }
    }
  };

  const playAlarmSound = () => {
    stopAllAudio();
    const audio = new Audio(alarmSound);
    audioRef.current = audio;
    audio.play().catch((err) => {
      console.error('Error playing alarm sound:', err);
    });
  };

  const playButtonSound = () => {
    stopAllAudio();

    //  trim the audio context
    const getAudioContextCtor = (): typeof AudioContext => {
      if ('AudioContext' in window && typeof window.AudioContext !== 'undefined') {
        return window.AudioContext;
      }
      const w = window as unknown as { webkitAudioContext?: typeof AudioContext };
      if (w.webkitAudioContext) {
        return w.webkitAudioContext;
      }
      throw new Error('AudioContext not supported in this browser');
    };
    const AudioContextCtor = getAudioContextCtor();
    const audioContext = new AudioContextCtor();

    fetch(buttonSound)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
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

        buttonAudioRef.current = source;
      })
      .catch((error) => {
        console.error('Error playing button sound:', error);
        // fallback to regular audio if trimming fails
        const audio = new Audio(buttonSound);
        buttonAudioRef.current = audio;
        audio.play().catch((err) => console.error('Error playing fallback button sound:', err));
      });
  };

  const start = () => {
    if (!running) {
      playButtonSound();
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
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
      <Typography variant="h2" color="textPrimary">
        {minutes}:{secs}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button variant="contained" color={getButtonColor()} onClick={start} disabled={running}>
          Start
        </Button>
        <Button variant="outlined" color={getButtonColor()} onClick={pause} disabled={!running}>
          Pause
        </Button>
        <Button variant="outlined" color={getButtonColor()} onClick={reset}>
          Reset
        </Button>
      </Stack>
    </Paper>
  );
};

export default Timer;
