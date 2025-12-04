import React, { useRef, useState } from 'react';
import { Card, CardContent, IconButton, Stack, Typography, Box } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import { Task } from '../../types/Task';

type OpenTaskOpts = { action?: 'reminder' | 'image'; anchor?: HTMLElement | null } | undefined;

type Props = {
    task: Task;
    cardColor?: string;
    onTogglePin: (id: number) => Promise<void> | void;
    onDelete: (id: number) => Promise<void> | void;
    onOpenTask?: (task: Task, opts?: OpenTaskOpts) => void;
    onRemind?: (task: Task) => void;
    onAddImage?: (task: Task) => void;
};

const TaskListItem: React.FC<Props> = ({
    task,
    cardColor = '#fff',
    onTogglePin,
    onDelete,
    onOpenTask,
    onRemind,
    onAddImage,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);

    const controlsVisible = hovered || focused;
    const isPinned = Boolean(task.pinned);

    const handleFocus = () => setFocused(true);
    const handleBlur = (e: React.FocusEvent) => {
        const related = e.relatedTarget as Node | null;
        if (containerRef.current && related && containerRef.current.contains(related)) {
            // focus moved to child -> keep focused
            return;
        }
        setFocused(false);
    };

    return (
        <Card
            ref={containerRef}
            sx={{
                bgcolor: cardColor,
                borderRadius: 2,
                border: isPinned ? '2px solid' : '1px solid transparent',
                borderColor: isPinned ? 'secondary.main' : 'transparent',
                boxShadow: isPinned ? '0 10px 25px rgba(0,0,0,0.18)' : '0 6px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                minHeight: 140,
                cursor: onOpenTask ? 'pointer' : 'default',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.16)',
                },
                display: 'flex',
                flexDirection: 'column',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={-1}
        >
            <CardContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, position: 'relative' }}
                onClick={() => onOpenTask && onOpenTask(task)}
            >
                {/* Top row: title on the left, pin button on the right */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 700,
                            mr: 1,
                            wordBreak: 'break-word',
                        }}
                    >
                        {task.title}
                    </Typography>

                    <IconButton
                        aria-label={isPinned ? 'unpin task' : 'pin task'}
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            void onTogglePin(task.id);
                        }}
                        sx={{
                            color: isPinned ? 'secondary.main' : 'text.secondary',
                            ml: 'auto',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                        }}
                    >
                        {isPinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                    </IconButton>
                </Stack>

                <Typography
                    variant="subtitle1"
                    sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        fontWeight: 600,
                        mb: 1,
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {task.description.trim()}
                </Typography>

                {task.imageUrl && (
                    <Box
                        sx={{
                            width: '100%',
                            mb: 1,
                            borderRadius: 1,
                            overflow: 'hidden',
                            '& img': {
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                objectFit: 'cover',
                            },
                        }}
                    >
                        <img
                            src={task.imageUrl.startsWith('http') ? task.imageUrl : `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}${task.imageUrl}`}
                            alt="Task attachment"
                            onError={(e) => {
                                // Hide image if it fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </Box>
                )}

                {/* Action buttons (reminder, image, delete) - revealed on hover/focus */}
                <Stack direction="row" justifyContent="flex-start" alignItems="center">
                    <Stack
                        direction="row"
                        spacing={0.5}
                        className="task-actions"
                        sx={{
                            mt: 0.5,
                            transition: 'opacity 120ms ease, transform 120ms ease',
                            opacity: controlsVisible ? 1 : 0,
                            transform: controlsVisible ? 'translateY(0)' : 'translateY(6px)',
                            pointerEvents: controlsVisible ? 'auto' : 'none',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <IconButton
                            aria-label="remind me"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                // call onRemind if provided; otherwise fall back to opening editor
                                if (onRemind) {
                                    onRemind(task);
                                } else {
                                    onOpenTask && onOpenTask(task, { action: 'reminder', anchor: e.currentTarget });
                                }
                            }}
                        >
                            <NotificationsNoneIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            aria-label="add image"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onAddImage) {
                                    onAddImage(task);
                                } else {
                                    onOpenTask && onOpenTask(task, { action: 'image', anchor: e.currentTarget });
                                }
                            }}
                        >
                            <ImageOutlinedIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            aria-label="delete task"
                            size="small"
                            onClick={async (e) => {
                                e.stopPropagation();
                                await onDelete(task.id);

                            }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default TaskListItem;
