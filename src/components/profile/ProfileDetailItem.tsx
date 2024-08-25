import { Grid, Typography, Tooltip } from '@mui/material';
import { stringOrPlaceholder } from '../../utils/stringUtil';
import React from 'react';

type ProfileDetailItemProps = {
  title: string;
  text: string | React.ReactNode | null;
  tooltip?: React.ReactNode;
};

export function ProfileDetailItem({ title, text, tooltip }: ProfileDetailItemProps) {
  return (
    <Grid item>
      <Grid item>
        <Typography component="dt" variant="body1" sx={{ fontWeight: 700 }}>
          {stringOrPlaceholder(title)}
        </Typography>
      </Grid>
      <Grid width="fit-content">
        {tooltip ? (
          <Tooltip
            arrow
            title={<Typography variant="body2">{tooltip}</Typography>}
            placement="top-start"
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -10],
                    },
                  },
                ],
              },
            }}
          >
            <Typography component="dd" paragraph variant="body1">
              {text}
            </Typography>
          </Tooltip>
        ) : (
          <Typography component="dd" paragraph variant="body1">
            {text}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
