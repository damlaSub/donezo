import React, { useEffect, useRef } from 'react';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { Box, useTheme } from '@mui/material';
import { Task } from '../../types/Task';
import TaskListItem from './TaskListItem';

type Props = {
  tasks: Task[];
  onTogglePin: (id: number) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
  onOpenTask?: (
    task: Task,
    opts?: { action?: 'reminder' | 'image'; anchor?: HTMLElement | null },
  ) => void;
  onRemind?: (task: Task) => void;
  onAddImage?: (task: Task) => void;
};

const TaskList: React.FC<Props> = ({
  tasks,
  onTogglePin,
  onDelete,
  onOpenTask,
  onRemind,
  onAddImage,
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const msnryRef = useRef<any>(null);

  const sorted = [...tasks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    const createdA = new Date(a.createdAt).getTime();
    const createdB = new Date(b.createdAt).getTime();
    return createdB - createdA;
  });

  const cardColors = ['#F3E5F5', '#E3F2FD', '#E8F5E9', '#FFF3E0', '#FBE9E7', '#E0F7FA'];

  // initialize Masonry once
  useEffect(() => {
    if (!containerRef.current) return;

    msnryRef.current = new Masonry(containerRef.current, {
      itemSelector: '.task-item',
      columnWidth: '.grid-sizer',
      percentPosition: true,
      gutter: parseInt(theme.spacing(2).replace('px', ''), 10) || 16,
      horizontalOrder: true,
    });

    imagesLoaded(containerRef.current, () => {
      msnryRef.current.layout();
    });

    return () => {
      msnryRef.current && msnryRef.current.destroy();
      msnryRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // relayout whenever tasks change
  useEffect(() => {
    if (!msnryRef.current || !containerRef.current) return;
    imagesLoaded(containerRef.current, () => {
      msnryRef.current.reloadItems();
      msnryRef.current.layout();
    });
  }, [tasks]);

  const columnWidthPx = 320;

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      {/* grid-sizer tells Masonry the column width */}
      <div className="grid-sizer" style={{ width: columnWidthPx }} />
      {sorted.map((task, index) => (
        <div
          key={task.id}
          className="task-item"
          style={{
            width: columnWidthPx,
            marginBottom: parseInt(theme.spacing(2).replace('px', ''), 10) || 16,
            display: 'inline-block',
            verticalAlign: 'top',
          }}
        >
          <TaskListItem
            task={task}
            cardColor={cardColors[index % cardColors.length]}
            onTogglePin={onTogglePin}
            onDelete={onDelete}
            onOpenTask={(t) => onOpenTask && onOpenTask(t)}
            onRemind={onRemind}
            onAddImage={onAddImage}
          />
        </div>
      ))}
    </Box>
  );
};

export default TaskList;
