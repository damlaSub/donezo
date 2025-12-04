// import React from 'react';
// import { Box } from '@mui/material';
// import { Task } from '../../types/Task';
// import TaskListItem from './TaskListItem';

// type Props = {
//   tasks: Task[];
//   onTogglePin: (id: number) => Promise<void> | void;
//   onDelete: (id: number) => Promise<void> | void;
//   onOpenTask?: (task: Task) => void;
// };

// const TaskList: React.FC<Props> = ({ tasks, onTogglePin, onDelete, onOpenTask }) => {
//   const sortedTasks = [...tasks].sort((a, b) => {
//     if (a.pinned && !b.pinned) return -1;
//     if (!a.pinned && b.pinned) return 1;

//     const createdA = new Date(a.createdAt).getTime();
//     const createdB = new Date(b.createdAt).getTime();
//     return createdB - createdA;
//   });

//   const cardColors = ['#F3E5F5', '#E3F2FD', '#E8F5E9', '#FFF3E0', '#FBE9E7', '#E0F7FA'];

//   return (
//     <Box
//       sx={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 320px))',
//         gap: 2,
//       }}
//     >
//       {sortedTasks.map((task, index) => (
//         <TaskListItem
//           key={task.id}
//           task={task}
//           cardColor={cardColors[index % cardColors.length]}
//           onTogglePin={onTogglePin}
//           onDelete={onDelete}
//           onOpenTask={onOpenTask}
//         />
//       ))}
//     </Box>
//   );
// };

// export default TaskList;
import React from 'react';
import { Box } from '@mui/material';
import { Task } from '../../types/Task';
import TaskListItem from './TaskListItem';

type Props = {
  tasks: Task[];
  onTogglePin: (id: number) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
  onOpenTask?: (task: Task, opts?: { action?: 'reminder' | 'image'; anchor?: HTMLElement | null }) => void;
  onRemind?: (task: Task) => void;
  onAddImage?: (task: Task) => void;
};

const TaskList: React.FC<Props> = ({ tasks, onTogglePin, onDelete, onOpenTask, onRemind, onAddImage }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    const createdA = new Date(a.createdAt).getTime();
    const createdB = new Date(b.createdAt).getTime();
    return createdB - createdA;
  });

  const cardColors = ['#F3E5F5', '#E3F2FD', '#E8F5E9', '#FFF3E0', '#FBE9E7', '#E0F7FA'];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 320px))',
        gap: 2,
      }}
    >
      {sortedTasks.map((task, index) => (
        <TaskListItem
          key={task.id}
          task={task}
          cardColor={cardColors[index % cardColors.length]}
          onTogglePin={onTogglePin}
          onDelete={onDelete}
          onOpenTask={(t) => onOpenTask && onOpenTask(t)}
          onRemind={onRemind}
          onAddImage={onAddImage}
        />
      ))}
    </Box>
  );
};

export default TaskList;