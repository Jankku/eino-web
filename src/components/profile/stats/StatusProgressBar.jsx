import { Grid } from '@mui/material';

export function StatusProgressBar({ data, total }) {
  return (
    <Grid container aria-label="Status bar">
      {total ? (
        data.map((item, index) => (
          <Grid
            key={index}
            item
            aria-label={item.title}
            style={{
              width: `${(item.value / total) * 100}%`,
              height: '8px',
              backgroundColor: item.color,
            }}
          ></Grid>
        ))
      ) : (
        <Grid
          item
          aria-label="No data"
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#858585',
          }}
        ></Grid>
      )}
    </Grid>
  );
}
