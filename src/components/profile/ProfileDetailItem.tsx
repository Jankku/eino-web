import { Grid, Typography } from '@mui/material';
import React from 'react';

type ProfileDetailItemProps = {
  title: string;
  text: string | React.ReactNode | null;
};

export function ProfileDetailItem({ title, text }: ProfileDetailItemProps) {
  return (
    <Grid item>
      <Grid item>
        <Typography
          component="dt"
          variant="body1"
          sx={{
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid
        sx={{
          width: 'fit-content',
        }}
      >
        <Typography component="dd" variant="body1" sx={{ display: 'flex' }}>
          {text}
        </Typography>
      </Grid>
    </Grid>
  );
}
