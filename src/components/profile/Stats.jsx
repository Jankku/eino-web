import { useTheme } from '@emotion/react';
import { Card, CardContent, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import ProfileDetailItem from './ProfileDetailItem';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function Stats({ title, stats }) {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.only('xs'));
  const scores = stats.score_distribution;
  const scoreCount = scores.map((item) => item.count);
  const isBookStats = stats.pages_read ? true : false;

  const options = {
    responsive: true,
    aspectRatio: matchesXs ? 1.5 : 2,
    layout: {
      padding: {
        left: 10,
        right: 10,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Score distribution',
        color: theme.palette.text.primary,
        font: {
          size: 16,
        },
      },
      datalabels: {
        display: true,
        color: theme.palette.text.primary,
        align: 'end',
        anchor: 'end',
        font: { size: '14' },
      },
    },
    scales: {
      y: {
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      x: {
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  const data = {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    color: theme.palette.text.primary,
    datasets: [
      {
        label: 'Count',
        data: scoreCount,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.primary.main,
      },
    ],
  };

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ pl: 2 }}>
          <h2>{title}</h2>
          <ProfileDetailItem title={'Count'} text={stats.count} />
          {isBookStats ? (
            <ProfileDetailItem title={'Pages read'} text={stats.pages_read} />
          ) : (
            <ProfileDetailItem title={'Watch time'} text={`${stats.watch_time} hours`} />
          )}
          <ProfileDetailItem title={'Average score'} text={stats.score_average} />
        </Box>
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </CardContent>
    </Card>
  );
}

export default Stats;
