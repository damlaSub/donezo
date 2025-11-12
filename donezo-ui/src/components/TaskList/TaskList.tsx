import React from 'react';
import { List, ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../../types/Task';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  selectedTaskId?: number | null;
  onSelect?: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  selectedTaskId,
  onSelect,
}) => {
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
      {sortedTasks.map((task) => {
        console.log('Rendering task:', task);
        return (
          <ListItem
            key={task.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
            onClick={() => onSelect && onSelect(task.id)}
            sx={{
              bgcolor: selectedTaskId === task.id ? 'action.selected' : 'transparent',
              borderRadius: 1,
              cursor: onSelect ? 'pointer' : 'default',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Checkbox
              checked={task.completed}
              onChange={(e) => {
                e.stopPropagation();
                onToggle(task.id);
              }}
              onClick={(e) => e.stopPropagation()}
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
                maxWidth: 'calc(100vw - 200px)',
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default TaskList;
