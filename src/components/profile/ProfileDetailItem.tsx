import { Typography, Stack, Box } from '@mui/material';
import React from 'react';

type ProfileDetailItemProps = {
  title: string;
  text: string | React.ReactNode | null;
  actions?: React.ReactNode;
};

export function ProfileDetailItem({ title, text, actions }: ProfileDetailItemProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        flexWrap: 'wrap',
        width: '100%',
        rowGap: 1,
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
      }}
    >
      <Box sx={{ flexGrow: 2 }}>
        <Typography component="dt" variant="body1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography component="dd" variant="body1" sx={{ display: 'flex' }}>
          {text}
        </Typography>
      </Box>
      {actions ? <Box>{actions}</Box> : undefined}
    </Stack>
  );
}
