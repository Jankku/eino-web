import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { statusColors } from '../../../utils/profileUtil';
import { Profile } from '../../../data/profile/profile.types';

const formatter = new Intl.NumberFormat();

type StatsStatusTableProps = {
  stats: Profile['stats']['book'] | Profile['stats']['movie'];
  statuses: string[];
};

export function StatsStatusTable({ stats, statuses }: StatsStatusTableProps) {
  const isMobile = useIsMobile();

  const cellAlign = isMobile ? 'right' : undefined;

  return (
    <Table size="small" aria-label="Book count table">
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography fontWeight={500}>Status</Typography>
          </TableCell>
          <TableCell align={cellAlign}>
            <Typography fontWeight={500}>Count</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {statuses.map((status) => (
          <TableRow hover key={status}>
            <TableCell padding="none">
              <Grid container alignItems="center" gap={1}>
                <StatusIndicator color={statusColors[status as keyof typeof statusColors]} />
                <Typography component="p" p={0} m={0} textTransform="capitalize">
                  {status}
                </Typography>
              </Grid>
            </TableCell>
            <TableCell align={cellAlign}>
              <Typography>{formatter.format(stats.count[status])}</Typography>
            </TableCell>
          </TableRow>
        ))}
        <TableRow hover key="all">
          <TableCell variant="footer">
            <Typography fontWeight={500}>Total</Typography>
          </TableCell>
          <TableCell variant="footer" align={cellAlign}>
            <Typography fontWeight={500}>{formatter.format(stats.count['all'])}</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function StatusIndicator({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: 12, height: 12, backgroundColor: color, borderRadius: 8 }}
    ></span>
  );
}
