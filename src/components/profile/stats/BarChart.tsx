import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useMediaQuery, useTheme } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

type BarChartProps = {
  labels: (number | string)[];
  data: number[];
  onClick: (index: number) => void;
};

export function BarChart({ labels, data, onClick }: BarChartProps) {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.only('xs'));

  const options = {
    responsive: true,
    aspectRatio: matchesXs ? 1.4 : 2,
    plugins: {
      title: {
        display: true,
        text: 'Score distribution',
        color: theme.palette.text.primary,
        padding: { bottom: 12, top: 2 },
        font: {
          size: 16,
          family: theme.typography.fontFamily,
        },
      },
      datalabels: {
        display: true,
        color: theme.palette.text.primary,
        align: 'end',
        anchor: 'end',
        font: { size: 14 },
        formatter: (value) => {
          return Number.parseInt(value) === 0 ? null : value;
        },
      },
    },
    scales: {
      y: {
        display: true,
        title: {
          display: false,
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
        },
        grid: {
          display: false,
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
    onClick: (_, elements) =>
      elements?.[0]?.index !== undefined ? onClick(elements[0].index) : undefined,
    onHover: (event, elements) => {
      if (event?.native?.target) {
        // @ts-expect-error -- no types
        event.native.target.style.cursor = elements[0] ? 'pointer' : 'default';
      }
    },
  } satisfies ChartOptions;

  const tableData = {
    labels,
    color: theme.palette.text.primary,
    datasets: [
      {
        label: 'Count',
        data,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.primary.main,
      },
    ],
  };

  return (
    <Bar
      data={tableData}
      options={options}
      plugins={[ChartDataLabels]}
      aria-label="Score distribution chart"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
