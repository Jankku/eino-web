import { Card, CardContent, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { ProfileDetailItem } from '../ProfileDetailItem';
import { StatsStatusTable } from './StatsStatusTable';
import { BarChart } from './BarChart';
import { useMemo } from 'react';
import { useTheme } from '@emotion/react';

const formatter = new Intl.NumberFormat();

export function MovieStats({ stats }) {
  const theme = useTheme();
  const scoreCounts = stats.score_distribution.map((item) => item.count);

  const tableData = useMemo(
    () => ({
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      color: theme.palette.text.primary,
      datasets: [
        {
          label: 'Count',
          data: scoreCounts,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.main,
        },
      ],
    }),
    [scoreCounts, theme],
  );

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 2 }}>
          <h2>Movie stats</h2>
          <Grid container columns={1} rowGap={2}>
            <Grid container spacing={4}>
              <ProfileDetailItem
                title={'Watch time'}
                text={`${formatter.format(stats.watch_time)} hours`}
              />
              <ProfileDetailItem title={'Average score'} text={stats.score_average} />
            </Grid>
            <Grid item sx={{ width: '100%' }}>
              <StatsStatusTable type={'movie'} stats={stats} />
            </Grid>
            <BarChart data={tableData} />
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
