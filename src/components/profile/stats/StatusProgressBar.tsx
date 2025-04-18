import { GridLegacy } from '@mui/material';

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
    <GridLegacy container aria-label="Status bar" sx={{ flexWrap: 'nowrap' }}>
      {total ? (
        data.map((item, index) => (
          <GridLegacy
            key={index}
            item
            aria-label={`${item.title}, ${item.value} of ${total}`}
            style={{
              width: `${(item.value / total) * 100}%`,
              minWidth: `${item.value ? '5px' : undefined}`,
              height: '10px',
              backgroundColor: item.color,
            }}
          ></GridLegacy>
        ))
      ) : (
        <GridLegacy
          item
          aria-label="No data"
          style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#858585',
          }}
        ></GridLegacy>
      )}
    </GridLegacy>
  );
}
