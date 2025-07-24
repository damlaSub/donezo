import React from 'react';
import { List, ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../../types/Task';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => (
  <List>
    {tasks.map(task => (
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
        />
        <ListItemText
          primary={task.name}
          style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
        />
      </ListItem>
    ))}
  </List>
);

export default TaskList;
