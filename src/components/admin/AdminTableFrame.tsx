import { ReactNode, useEffect, useState } from 'react';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { gridClasses } from '@mui/x-data-grid';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

type AdminTableFrameProps = {
  label: string;
  pagination: ReactNode;
  children: ReactNode;
};

export default function AdminTableFrame({ label, pagination, children }: AdminTableFrameProps) {
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (!fullScreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [fullScreen]);

  return (
    <Box
      component="section"
      aria-label={`${label} table`}
      onKeyDown={(event) => {
        if (
          fullScreen &&
          event.key === 'Escape' &&
          !event.defaultPrevented &&
          !(event.target as Element).closest(`.${gridClasses['row--editing']}`) &&
          event.currentTarget.contains(event.target as Node)
        ) {
          event.stopPropagation();
          setFullScreen(false);
        }
      }}
      sx={
        fullScreen
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: (theme) => theme.zIndex.drawer + 1,
              bgcolor: 'background.paper',
              p: { xs: 1, sm: 2 },
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
            }
          : undefined
      }
    >
      <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 1, flexShrink: 0 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>{pagination}</Box>
        <Tooltip title={fullScreen ? 'Exit full screen' : 'Full screen'}>
          <IconButton
            aria-label={`${fullScreen ? 'Exit full screen' : 'Full screen'} ${label.toLowerCase()} table`}
            aria-pressed={fullScreen}
            onClick={() => setFullScreen((previous) => !previous)}
            sx={{ my: 1, flexShrink: 0, color: 'text.secondary' }}
          >
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
      <Box sx={{ height: 500, ...(fullScreen && { flex: 1, minHeight: 200 }) }}>{children}</Box>
    </Box>
  );
}
