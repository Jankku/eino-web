import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

export function BarChart({ data }) {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.only('xs'));

  const options = useMemo(
    () => ({
      responsive: true,
      aspectRatio: matchesXs ? 1.5 : 2,
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
          formatter: (value) => {
            return Number(value) === 0 ? null : value;
          },
        },
      },
      scales: {
        y: {
          display: true,
          title: {
            display: true,
            text: 'Count',
            align: 'center',
            font: {
              weight: 'bold',
              size: 12,
            },
          },
          grace: 4,
          ticks: {
            color: theme.palette.text.secondary,
            stepSize: 1,
          },
          grid: {
            color: theme.palette.divider,
          },
        },
        x: {
          title: {
            display: true,
            text: 'Score',
            font: {
              weight: 'bold',
              size: 12,
            },
          },
          ticks: {
            color: theme.palette.text.secondary,
          },
          grid: {
            color: theme.palette.divider,
          },
        },
      },
    }),
    [matchesXs, theme],
  );

  return (
    <Bar
      data={data}
      options={options}
      plugins={[ChartDataLabels]}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
