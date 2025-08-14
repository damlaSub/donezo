// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3', // Blue for Calendar
    },
    secondary: {
      main: '#FFC107', // Amber/Gold for Notes
    },
    error: {
      main: '#E53935', // Tomato red for Pomodoro
    },
    background: {
      default: '#fafafa', // Light neutral
      paper: '#FFFFFF',
    },
    text: {
      primary: '#222B45',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
});
export default theme;
