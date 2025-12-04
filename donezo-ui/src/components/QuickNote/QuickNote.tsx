import React, { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';

type Props = {
  onAdd: (title: string | null, description: string) => Promise<void>;
  placeholder?: string;
};

const QuickNote: React.FC<Props> = ({ onAdd, placeholder = 'Take a note...' }) => {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (expanded && inputRef.current) inputRef.current.focus();
  }, [expanded]);

  const submit = async () => {
    const trimmedTitle = title.trim();
    const trimmedDraft = draft.trim();
    if (!trimmedDraft) {
      setExpanded(false);
      return;
    }
    await onAdd(trimmedTitle || null, trimmedDraft);
    setTitle('');
    setDraft('');
    setExpanded(false);
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (!title.trim() && !draft.trim()) setExpanded(false);
      }}
    >
      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        elevation={expanded ? 4 : 1}
        onClick={() => setExpanded(true)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mb: 4,
          px: 2,
          py: expanded ? 2 : 1.5,
          borderRadius: 3,
          cursor: 'text',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          transform: expanded ? 'translateY(-1px)' : 'none',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {expanded && (
            <InputBase
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ fontWeight: 600, fontSize: 16 }}
            />
          )}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <InputBase
              inputRef={inputRef}
              placeholder={placeholder}
              value={draft}
              onFocus={() => setExpanded(true)}
              onChange={(e) => setDraft(e.target.value)}
              multiline={expanded}
              minRows={expanded ? 2 : 1}
              sx={{ flex: 1, fontWeight: 500, fontSize: 16, pr: expanded ? 1 : 0 }}
            />
            {expanded && (
              <Button
                variant="contained"
                size="small"
                type="submit"
                disabled={!draft.trim()}
                color="secondary"
                sx={{ alignSelf: 'center', textTransform: 'none', fontWeight: 600 }}
              >
                Add
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </ClickAwayListener>
  );
};

export default QuickNote;
export { };