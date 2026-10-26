import { Box } from '@mui/material';

type StatusProgressBarItem = {
  title: string;
  value: number;
  color: string;
};

type StatusProgressBarProps = {
  data: StatusProgressBarItem[];
  total: number;
};

export function StatusProgressBar({ data, total }: StatusProgressBarProps) {
  return (
    <Box aria-label="Status bar" sx={{ display: 'flex', width: '100%', flexWrap: 'nowrap' }}>
      {total ? (
        data.map((item, index) => (
          <Box
            // eslint-disable-next-line @eslint-react/no-array-index-key
            key={index}
            aria-label={`${item.title}, ${item.value} of ${total}`}
            sx={{
              width: `${(item.value / total) * 100}%`,
              minWidth: item.value ? '5px' : undefined,
              height: '10px',
              backgroundColor: item.color,
            }}
          ></Box>
        ))
      ) : (
        <Box
          aria-label="No data"
          sx={{
            width: '100%',
            height: '10px',
            backgroundColor: '#858585',
          }}
        ></Box>
      )}
    </Box>
  );
}
