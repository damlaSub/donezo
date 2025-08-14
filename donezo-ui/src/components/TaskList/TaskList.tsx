import React from 'react';
import { List, ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../../types/Task';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });


  return (
    <List>
      {sortedTasks.map(task => {
        console.log('Rendering task:', task);
        return (
          <ListItem
            key={task.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              sx={{
                '&.Mui-checked': {
                  color: 'secondary.main',
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                },
              }}
            />
            <ListItemText
              primary={task.name.trim()}
              style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100vw - 200px)'
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default TaskList;
