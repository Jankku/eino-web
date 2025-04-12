import { GridLegacy, Typography } from '@mui/material';
import React from 'react';

type ProfileDetailItemProps = {
  title: string;
  text: string | React.ReactNode | null;
  actions?: React.ReactNode;
};

export function ProfileDetailItem({ title, text, actions }: ProfileDetailItemProps) {
  return (
    <GridLegacy
      container
      direction={{ xs: 'column', sm: 'row' }}
      rowGap={1}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
    >
      <GridLegacy item flexGrow={2}>
        <Typography component="dt" variant="body1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography component="dd" variant="body1" sx={{ display: 'flex' }}>
          {text}
        </Typography>
      </GridLegacy>
      {actions ? <GridLegacy item>{actions}</GridLegacy> : undefined}
    </GridLegacy>
  );
}
