import { Grid, Typography } from '@mui/material';
import React from 'react';

type ProfileDetailItemProps = {
  title: string;
  text: string | React.ReactNode | null;
  actions?: React.ReactNode;
};

export function ProfileDetailItem({ title, text, actions }: ProfileDetailItemProps) {
  return (
    <Grid
      container
      direction={{ xs: 'column', sm: 'row' }}
      rowGap={1}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
    >
      <Grid item flexGrow={2}>
        <Typography component="dt" variant="body1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography component="dd" variant="body1" sx={{ display: 'flex' }}>
          {text}
        </Typography>
      </Grid>
      {actions ? <Grid item>{actions}</Grid> : undefined}
    </Grid>
  );
}
