import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';
import { Task } from '../../types/Task';
import { uploadImage, CreateUpdateTaskPayload } from '../../api/tasksApi';

type Props = {
    open: boolean;
    task: Task | null;
    onClose: () => void;
    onSave: (id: number, payload: CreateUpdateTaskPayload) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
};

const TaskEditorDialog: React.FC<Props> = ({ open, task, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reminderAt, setReminderAt] = useState<string | ''>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [reminderAnchor, setReminderAnchor] = useState<HTMLElement | null>(null);
    const [pickerDate, setPickerDate] = useState<string>(''); // yyyy-mm-dd from <input type=date>
    const [pickerTime, setPickerTime] = useState<string>(''); // HH:MM from <input type=time>

    const [initialSnapshot, setInitialSnapshot] = useState<string>('');

    useEffect(() => {
        setTitle(task?.title ?? '');
        setDescription(task?.description ?? '');
        setReminderAt(task?.reminderAt ? toLocalDatetimeValue(task.reminderAt) : '');
        setImageUrl(task?.imageUrl ?? null);
        setUploading(false);

        const snap = JSON.stringify({
            title: task?.title ?? '',
            description: task?.description ?? '',
            reminderAt: task?.reminderAt ?? null,
            imageUrl: task?.imageUrl ?? null,
        });
        setInitialSnapshot(snap);

        if (task?.reminderAt) {
            const local = toLocalDatetimeValue(task.reminderAt); // YYYY-MM-DDTHH:MM
            const [datePart, timePart] = local.split('T');
            setPickerDate(datePart ?? '');
            setPickerTime(timePart ?? '');
        } else {
            setPickerDate('');
            setPickerTime('');
        }
    }, [task]);

    function toLocalDatetimeValue(iso?: string): string {
        if (!iso) return '';
        const d = new Date(iso);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    }

    function localDateTimeToISO(dateStr: string, timeStr: string): string {
        if (!dateStr) return '';
        // time may be '' -> default to 00:00
        const time = timeStr || '00:00';
        const combined = `${dateStr}T${time}`;
        const d = new Date(combined);
        return d.toISOString();
    }

    const isDirty = (): boolean => {
        const currentSnap = JSON.stringify({
            title: title.trim() || '',
            description,
            reminderAt: reminderAt ? new Date(reminderAt).toISOString() : null,
            imageUrl: imageUrl ?? null,
        });
        return currentSnap !== initialSnapshot;
    };

    const handleAutoSaveAndClose = async () => {
        if (!task) {
            onClose();
            return;
        }
        if (isDirty()) {
            const payload: CreateUpdateTaskPayload = {
                title: title.trim() || null,
                description,
                reminderAt: reminderAt ? new Date(reminderAt).toISOString() : null,
                imageUrl: imageUrl ?? null,
            };
            try {
                await onSave(task.id, payload);
            } catch (err) {
                console.error('Failed to save task on close:', err);
            }
        }
        onClose();
    };

    const handleDelete = async () => {
        if (!task) return;
        try {
            await onDelete(task.id);
        } catch (err) {
            console.error('Failed to delete task:', err);
        } finally {
            onClose();
        }
    };

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];

        setUploading(true);
        try {
            const url = await uploadImage(file);
            setImageUrl(url);
        } catch (err) {
            console.error('Image upload failed', err);
            //TODO: snackbar
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const openReminderPicker = (e: React.MouseEvent<HTMLElement>) => {
        setReminderAnchor(e.currentTarget);
    };
    const closeReminderPicker = () => {
        setReminderAnchor(null);
    };
    const reminderOpen = Boolean(reminderAnchor);

    const handleDatePicked = (dateVal: string) => {
        setPickerDate(dateVal);
        const iso = localDateTimeToISO(dateVal, pickerTime);
        setReminderAt(iso || '');
    };

    const handleTimePicked = (timeVal: string) => {
        setPickerTime(timeVal);
        const iso = localDateTimeToISO(pickerDate, timeVal);
        setReminderAt(iso || '');
        closeReminderPicker();
    };

    if (!task) return null;

    return (
        <Dialog
            open={open}
            onClose={() => {
                void handleAutoSaveAndClose();
            }}
            fullWidth
            maxWidth="sm"
        >
            <DialogContent dividers sx={{ bgcolor: 'transparent', p: 0 }}>
                <ClickAwayListener
                    onClickAway={() => {
                        void handleAutoSaveAndClose();
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            m: 2,
                            px: 2,
                            py: 2,
                            borderRadius: 3,
                            bgcolor: 'background.paper',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                        }}
                    >
                        <InputBase
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ fontWeight: 600, fontSize: 18, mb: 0.5 }}
                            fullWidth
                        />
                        <InputBase
                            placeholder="Take a note..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            minRows={3}
                            sx={{ fontWeight: 500, fontSize: 16 }}
                            fullWidth
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                <IconButton
                                    size="small"
                                    aria-label="remind me"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openReminderPicker(e);
                                    }}
                                >
                                    <NotificationsNoneIcon fontSize="small" />
                                </IconButton>

                                <Popover
                                    open={reminderOpen}
                                    anchorEl={reminderAnchor}
                                    onClose={() => {
                                        closeReminderPicker();
                                    }}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    disableRestoreFocus
                                >
                                    <Box sx={{ p: 1.25, minWidth: 220 }}>
                                        {/* Date picker - native input for compactness */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <input
                                                type="date"
                                                value={pickerDate}
                                                onChange={(e) => {
                                                    handleDatePicked(e.target.value);
                                                }}
                                                style={{
                                                    border: '1px solid rgba(0,0,0,0.08)',
                                                    padding: '6px 8px',
                                                    borderRadius: 6,
                                                    fontSize: 14,
                                                }}
                                            />
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    // clear reminder
                                                    setPickerDate('');
                                                    setPickerTime('');
                                                    setReminderAt('');
                                                    closeReminderPicker();
                                                }}
                                            >
                                                Clear
                                            </Button>
                                        </Box>

                                        {/* Time picker only appears after date chosen */}
                                        {pickerDate && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <input
                                                    type="time"
                                                    value={pickerTime}
                                                    onChange={(e) => {
                                                        handleTimePicked(e.target.value);
                                                    }}
                                                    style={{
                                                        border: '1px solid rgba(0,0,0,0.08)',
                                                        padding: '6px 8px',
                                                        borderRadius: 6,
                                                        fontSize: 14,
                                                    }}
                                                />
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        // pick default time (current time)
                                                        const now = new Date();
                                                        const hh = now.getHours().toString().padStart(2, '0');
                                                        const mm = now.getMinutes().toString().padStart(2, '0');
                                                        handleTimePicked(`${hh}:${mm}`);
                                                    }}
                                                >
                                                    Now
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Popover>

                                {/* display current reminder as small text (if any) */}
                                {reminderAt ? (
                                    <Box component="span" sx={{ fontSize: 13, color: 'text.secondary' }}>
                                        {new Date(reminderAt).toLocaleString()}
                                    </Box>
                                ) : null}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                <IconButton
                                    aria-label="add image"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    <ImageOutlinedIcon fontSize="small" />
                                </IconButton>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleFileSelect(e.target.files);
                                        if (e.target) e.target.value = '';
                                    }}
                                />

                                {uploading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CircularProgress size={18} />
                                        <Box component="span" sx={{ fontSize: 13 }}>
                                            Uploading...
                                        </Box>
                                    </Box>
                                ) : imageUrl ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <img
                                            src={imageUrl}
                                            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
                                        />
                                        <Button
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImageUrl(null);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                ) : null}
                            </Box>

                            <IconButton
                                aria-label="delete task"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    void handleDelete();
                                }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Paper>
                </ClickAwayListener>
            </DialogContent>
        </Dialog>
    );
};

export default TaskEditorDialog;
