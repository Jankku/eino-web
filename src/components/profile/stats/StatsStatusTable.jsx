import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import useIsMobile from '../../../hooks/useIsMobile';
import { statusColors } from '../../../utils/profileUtil';

export function StatsStatusTable({ type, stats }) {
  const isMobile = useIsMobile();
  const statuses = [
    'completed',
    type === 'book' ? 'reading' : 'watching',
    'on-hold',
    'dropped',
    'planned',
  ];
  const formatter = new Intl.NumberFormat();
  const cellAlign = isMobile ? 'right' : undefined;

  return (
    <Table size="small" aria-label="Book count table">
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography variant="subtitle2">Status</Typography>
          </TableCell>
          <TableCell align={cellAlign}>
            <Typography variant="subtitle2">Count</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {statuses.map((status) => (
          <TableRow key={status}>
            <TableCell padding="none">
              <Grid container alignItems="center" gap={1}>
                <StatusIndicator color={statusColors[status]} />
                <Typography paragraph p={0} m={0} textTransform="capitalize">
                  {status}
                </Typography>
              </Grid>
            </TableCell>
            <TableCell align={cellAlign}>{formatter.format(stats.count[status])}</TableCell>
          </TableRow>
        ))}
        <TableRow key="all">
          <TableCell variant="head">
            <Typography variant="subtitle2">Total</Typography>
          </TableCell>
          <TableCell variant="head" align={cellAlign}>
            <Typography variant="subtitle2">{formatter.format(stats.count['all'])}</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function StatusIndicator({ color }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: 12, height: 12, backgroundColor: color, borderRadius: 8 }}
    ></span>
  );
}
