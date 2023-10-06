import { Card, CardContent, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { StatsStatusTable } from './StatsStatusTable';
import { BarChart } from './BarChart';
import { useTheme } from '@emotion/react';
import { StatsItem } from './StatsItem';
import { statusColors } from '../../../utils/profileUtil';
import { StatusProgressBar } from './StatusProgressBar';

const formatter = new Intl.NumberFormat();

export function BookStats({ stats }) {
  const theme = useTheme();

  const scoreCounts = stats.score_distribution.map((item) => item.count);

  const tableData = {
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
  };

  const progressValues = Object.entries(stats.count)
    .filter(([key]) => key !== 'all')
    .map(([key, value]) => ({
      title: key,
      value: value,
      color: statusColors[key],
    }));

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 0 }}>
        <Box px={2}>
          <h2>Book stats</h2>
          <Grid container columns={1} rowGap={2}>
            <Grid container rowGap={1}>
              <Grid container justifyContent="space-between">
                <StatsItem title={'Pages read:'} text={formatter.format(stats.pages_read)} />
                <StatsItem title={'Average score:'} text={stats.score_average} />
              </Grid>
              <Grid item sx={{ width: '100%' }}>
                <StatusProgressBar data={progressValues} total={stats.count.all} />
                <StatsStatusTable type={'book'} stats={stats} />
              </Grid>
            </Grid>
            <BarChart data={tableData} />
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
