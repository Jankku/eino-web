import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import bookStatus from '../../../models/bookStatus';
import movieStatus from '../../../models/movieStatus';

export function StatsStatusTable({ type, stats }) {
  const statuses = type === 'book' ? bookStatus : movieStatus;
  const formatter = new Intl.NumberFormat();

  return (
    <Table size="small" aria-label="Book count table">
      <TableHead>
        <TableRow>
          <TableCell>Status</TableCell>
          <TableCell>Count</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {statuses.map((status) => (
          <TableRow key={status.value}>
            <TableCell>{status.name}</TableCell>
            <TableCell>{formatter.format(stats.count[status.value])}</TableCell>
          </TableRow>
        ))}
        <TableRow key={'all'}>
          <TableCell variant="head">Total</TableCell>
          <TableCell variant="head">{formatter.format(stats.count['all'])}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
