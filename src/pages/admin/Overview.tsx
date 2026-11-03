import { alpha } from '@mui/material/styles';
import { ReactNode, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { DateTime } from 'luxon';
import { useLocalStorage } from '@uidotdev/usehooks';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  Popover,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  capitalize,
} from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import Head from '../../components/common/Head';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { AdminOverview, OverviewPeriod, useAdminOverview } from '../../data/admin/useAdminOverview';
import { securityEventsAuditUrl } from '../../data/admin/useAuditLog';
import { getProfilePictureUrl } from '../../utils/profileUtil';
import { underscoreToSpace } from '../../utils/stringUtil';

const number = (value: number) => value.toLocaleString();
const humanize = (value: string) => capitalize(underscoreToSpace(value));
const utcDate = (value: string, format = 'dd LLL yyyy, HH:mm') =>
  DateTime.fromISO(value, { zone: 'utc' }).toFormat(format);
const panelSx = {
  p: { xs: 2, sm: 2.25 },
  minWidth: 0,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 2px 10px rgba(20, 50, 90, 0.04)',
};
const tableSx = {
  '& .MuiTableCell-root': { px: 1, py: 0.85, borderColor: 'divider', fontSize: '0.8125rem' },
  '& .MuiTableHead-root': { bgcolor: 'action.hover' },
};

function CircleIcon({ children, warning = false }: { children: ReactNode; warning?: boolean }) {
  return (
    <Avatar
      sx={(theme) => ({
        width: 44,
        height: 44,
        bgcolor: alpha(warning ? theme.palette.warning.main : theme.palette.primary.main, 0.1),
        color: warning ? 'warning.main' : 'primary.main',
        flexShrink: 0,
      })}
    >
      {children}
    </Avatar>
  );
}

function ViewLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Button
      component={RouterLink}
      to={to}
      size="small"
      endIcon={<ArrowForwardIcon />}
      sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}
    >
      {children}
    </Button>
  );
}

function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Paper component="section" elevation={0} sx={panelSx}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 1.25,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography component="h2" variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}

function EmptyRow({ columns, children }: { columns: number; children: ReactNode }) {
  return (
    <TableRow>
      <TableCell
        colSpan={columns}
        sx={{ height: 120, textAlign: 'center', color: 'text.secondary' }}
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

function SecurityProgress({
  icon,
  label,
  value,
  total,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  total: number;
  detail: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25 }}>
      <CircleIcon>{icon}</CircleIcon>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
          <Link
            component={RouterLink}
            to="/admin/users"
            underline="hover"
            color="text.primary"
            variant="body2"
          >
            {label}
          </Link>
          <Typography variant="body2">
            {number(value)} / {number(total)}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0}
          aria-label={label}
          sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { borderRadius: 4 } }}
        />
        <Typography variant="caption" color="text.secondary">
          {detail}
        </Typography>
      </Box>
      <IconButton
        component={RouterLink}
        to="/admin/users"
        size="small"
        aria-label={`Manage users: ${label}`}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}

function OverviewContent({ data }: { data: AdminOverview }) {
  const security = data.account_security;
  const summaries = [
    {
      title: 'Total users',
      total: data.users.total,
      added: data.users.registered,
      verb: 'registered',
      icon: <PeopleOutlineIcon />,
    },
    {
      title: 'Books',
      total: data.books.total,
      added: data.books.added,
      verb: 'added',
      icon: <MenuBookIcon />,
    },
    {
      title: 'Movies',
      total: data.movies.total,
      added: data.movies.added,
      verb: 'added',
      icon: <LocalMoviesIcon />,
    },
  ];
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
          gap: 1.5,
          mb: 2,
        }}
      >
        {summaries.map((summary) => (
          <Paper
            key={summary.title}
            elevation={0}
            sx={{ ...panelSx, display: 'flex', alignItems: 'flex-start', gap: 2, py: 2.5 }}
          >
            <CircleIcon>{summary.icon}</CircleIcon>
            <Box>
              <Typography variant="body2">{summary.title}</Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, my: 0.5, fontVariantNumeric: 'tabular-nums' }}
              >
                {number(summary.total)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <Box
                  component="span"
                  sx={{
                    color: 'success.main',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <ArrowUpwardIcon sx={{ fontSize: 15, verticalAlign: 'text-bottom', mr: 0.5 }} />+
                  {number(summary.added)}
                </Box>{' '}
                {summary.verb} in selected range
              </Typography>
            </Box>
          </Paper>
        ))}
        <Paper elevation={0} sx={{ ...panelSx, display: 'flex', gap: 2, py: 2.5 }}>
          <CircleIcon warning>
            <WarningAmberIcon />
          </CircleIcon>
          <Box>
            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 700 }}>
              Security events
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, my: 0.5 }}>
              {number(data.security_events.total)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Recorded in the last 24 hours
            </Typography>
            {data.security_events.total > 0 && (
              <ViewLink to={securityEventsAuditUrl}>Review events</ViewLink>
            )}
          </Box>
        </Paper>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.55fr) minmax(0, 1fr)' },
          gap: 1.5,
        }}
      >
        <Panel
          title="Recently active users"
          description="Latest logins · Newest first · UTC"
          action={<ViewLink to="/admin/users">View users</ViewLink>}
        >
          <TableContainer>
            <Table size="small" aria-label="Recently active users" sx={tableSx}>
              <TableHead>
                <TableRow>
                  {['User', 'Role', 'Last login (UTC)', 'Books', 'Movies'].map((label) => (
                    <TableCell key={label}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recently_active_users.map((user) => (
                  <TableRow key={user.user_id} hover>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to="/admin/users"
                        underline="hover"
                        color="inherit"
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
                        aria-label={`Manage user ${user.username}`}
                      >
                        <Avatar
                          src={getProfilePictureUrl(user.profile_picture_path)}
                          alt=""
                          sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 14 }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        {user.username}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={capitalize(user.role)}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        sx={{ height: 23, minWidth: 65 }}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <time dateTime={user.last_login_on}>{utcDate(user.last_login_on)}</time>
                    </TableCell>
                    <TableCell align="right">{number(user.book_count)}</TableCell>
                    <TableCell align="right">{number(user.movie_count)}</TableCell>
                  </TableRow>
                ))}
                {!data.recently_active_users.length && (
                  <EmptyRow columns={5}>No users have logged in yet.</EmptyRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Panel>
        <Panel title="Account security">
          <SecurityProgress
            icon={<MailOutlineIcon />}
            label="Email verified"
            value={security.email_verified}
            total={data.users.total}
            detail={`${number(security.email_unverified)} unverified`}
          />
          <Divider />
          <SecurityProgress
            icon={<LockOutlinedIcon />}
            label="Two-factor enabled"
            value={security.two_factor_enabled}
            total={data.users.total}
            detail={`${number(security.two_factor_disabled)} without 2FA`}
          />
          <Divider />
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, py: 1 }}>
            <RemoveCircleOutlineIcon color="action" />
            <Typography variant="body2" sx={{ flex: 1 }}>
              Disabled accounts
            </Typography>
            <Typography variant="body2">{number(security.disabled_accounts)}</Typography>
            <ViewLink to="/admin/users">View users</ViewLink>
          </Stack>
          {data.security_events.total > 0 && (
            <Button
              component={RouterLink}
              to={securityEventsAuditUrl}
              fullWidth
              color="warning"
              variant="outlined"
              startIcon={<WarningAmberIcon />}
              endIcon={<ChevronRightIcon />}
              sx={{ justifyContent: 'space-between', textTransform: 'none', mt: 0.5 }}
            >
              Review {number(data.security_events.total)} security events · Last 24 hours
            </Button>
          )}
        </Panel>
        <Panel
          title="Recent audit activity"
          description={`Today, ${utcDate(data.generated_on, 'dd LLL yyyy')} · UTC · Newest first`}
          action={<ViewLink to="/admin/audits">View audit log</ViewLink>}
        >
          <TableContainer>
            <Table size="small" aria-label="Recent audit activity today UTC" sx={tableSx}>
              <TableHead>
                <TableRow>
                  {['Time (UTC)', 'Actor', 'Action', 'Entity'].map((label) => (
                    <TableCell key={label}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recent_audit_activity.map((audit) => (
                  <TableRow key={audit.id} hover>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to="/admin/audits"
                        aria-label={`View audit event ${audit.id}`}
                      >
                        <time dateTime={audit.created_on}>
                          {utcDate(audit.created_on, 'HH:mm')}
                        </time>
                      </Link>
                    </TableCell>
                    <TableCell>{audit.username ?? 'Unknown'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        variant="outlined"
                        color={audit.action === 'login_failed' ? 'warning' : 'default'}
                        label={humanize(audit.action)}
                        sx={{ height: 23 }}
                      />
                    </TableCell>
                    <TableCell>
                      {audit.table_name ? humanize(audit.table_name) : '—'}
                      {audit.record_id && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', overflowWrap: 'anywhere' }}
                        >
                          {audit.record_id}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!data.recent_audit_activity.length && (
                  <EmptyRow columns={4}>No audit activity today (UTC).</EmptyRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Panel>
        <Panel
          title="Bulletins"
          description={`${number(data.bulletins.active)} active · ${number(data.bulletins.scheduled)} scheduled`}
        >
          {data.bulletins.items.map((bulletin) => {
            const audiences = {
              public: 'Public',
              authenticated: 'Signed-in users',
              user: 'Selected users',
              condition:
                bulletin.condition === '2fa_not_enabled'
                  ? 'Users without 2FA'
                  : bulletin.condition === 'email_not_verified'
                    ? 'Unverified users'
                    : bulletin.condition === 'account_anniversary'
                      ? 'Account anniversary'
                      : 'Conditional audience',
            };
            return (
              <Box
                key={bulletin.id}
                sx={{
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  py: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <CircleIcon>
                  <CampaignOutlinedIcon />
                </CircleIcon>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Link
                    component={RouterLink}
                    to="/admin/bulletins"
                    color="text.primary"
                    underline="hover"
                    variant="body2"
                    sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}
                  >
                    {bulletin.title}
                  </Link>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {audiences[bulletin.visibility]}
                    {bulletin.status === 'scheduled' &&
                      ` · Starts ${utcDate(bulletin.start_date)} UTC`}
                  </Typography>
                </Box>
                <Chip
                  label={capitalize(bulletin.status)}
                  color={bulletin.status === 'active' ? 'success' : 'primary'}
                  size="small"
                  variant="outlined"
                />
                <IconButton
                  component={RouterLink}
                  to="/admin/bulletins"
                  size="small"
                  aria-label={`Manage bulletin ${bulletin.title}`}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            );
          })}
          {!data.bulletins.items.length && (
            <Typography color="text.secondary" variant="body2" sx={{ py: 4 }}>
              No active or scheduled bulletins.
            </Typography>
          )}
          <Divider />
          <ViewLink to="/admin/bulletins">Manage bulletins</ViewLink>
        </Panel>
      </Box>
    </>
  );
}

function OverviewSkeleton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Box role="status" aria-label="Loading admin overview">
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        Loading overview…
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={index < 2 ? 150 : 270} />
        ))}
      </Box>
    </Box>
  );
}

const datePresets = [
  { label: 'Today', days: 1 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
] as const;

type DatePreset = (typeof datePresets)[number];

const defaultDatePreset = datePresets[2];

function presetPeriod({ days }: DatePreset): OverviewPeriod {
  const today = DateTime.utc().startOf('day');
  return { start_date: today.minus({ days: days - 1 }).toISODate()!, end_date: today.toISODate()! };
}

export default function Overview() {
  const [selection, setSelection] = useLocalStorage<DatePreset['days'] | OverviewPeriod>(
    'admin-overview-date-range',
    defaultDatePreset.days,
  );
  const preset =
    typeof selection === 'number'
      ? (datePresets.find((option) => option.days === selection) ?? defaultDatePreset)
      : null;
  const period =
    typeof selection === 'number' ? presetPeriod(preset ?? defaultDatePreset) : selection;
  const [draft, setDraft] = useState<{ start_date: DateTime | null; end_date: DateTime | null }>({
    start_date: DateTime.fromISO(period.start_date, { zone: 'utc' }),
    end_date: DateTime.fromISO(period.end_date, { zone: 'utc' }),
  });
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const { data, isPending, isFetching, isError, refetch } = useAdminOverview(period);
  const { showSuccessSnackbar } = useCustomSnackbar();
  const refreshOverview = async () => {
    const result = await refetch();
    if (result.isSuccess) showSuccessSnackbar('Overview refreshed');
  };
  const validRange = Boolean(
    draft.start_date?.isValid &&
    draft.end_date?.isValid &&
    draft.start_date.year >= 1 &&
    draft.end_date.year <= 9999 &&
    draft.start_date <= draft.end_date,
  );
  const displayedPeriod = isFetching ? period : (data?.period ?? period);
  const rangeLabel = [displayedPeriod.start_date, displayedPeriod.end_date]
    .map((date) =>
      DateTime.fromISO(date, { zone: 'utc' })
        .setLocale(navigator.language)
        .toLocaleString(DateTime.DATE_SHORT),
    )
    .join(' – ');

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: 4 }}>
      <Head pageTitle="Admin overview" />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ justifyContent: 'space-between', gap: 2, mb: 2 }}
      >
        <Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Overview
          </Typography>
        </Box>
        <Box>
          <Stack direction="row" spacing={1} sx={{ justifyContent: { md: 'flex-end' } }}>
            <Button
              variant="outlined"
              startIcon={<CalendarMonthIcon />}
              endIcon={<ExpandMoreIcon />}
              onClick={(event) => {
                setDraft({
                  start_date: DateTime.fromISO(period.start_date, { zone: 'utc' }),
                  end_date: DateTime.fromISO(period.end_date, { zone: 'utc' }),
                });
                setAnchor(event.currentTarget);
              }}
              aria-haspopup="dialog"
              aria-expanded={Boolean(anchor)}
              aria-controls={anchor ? 'overview-date-range' : undefined}
              sx={{ bgcolor: 'background.paper', textTransform: 'none', minWidth: 168 }}
            >
              {preset?.label ?? rangeLabel}
            </Button>
            <Tooltip title="Refresh overview">
              <span>
                <IconButton
                  aria-label={isFetching ? 'Refreshing overview' : 'Refresh overview'}
                  onClick={() => void refreshOverview()}
                  disabled={isFetching}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  {isFetching ? (
                    <CircularProgress size={24} aria-label="Refreshing overview" />
                  ) : (
                    <RefreshIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Box>
      </Stack>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box
          component="form"
          id="overview-date-range"
          role="dialog"
          aria-label="Select overview date range"
          sx={{ p: 2, width: { xs: 290, sm: 350 } }}
          onSubmit={(event) => {
            event.preventDefault();
            if (validRange) {
              setSelection({
                start_date: draft.start_date!.toISODate()!,
                end_date: draft.end_date!.toISODate()!,
              });
              setAnchor(null);
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Date range · UTC
          </Typography>
          <Stack spacing={2}>
            <Box
              role="group"
              aria-label="Date range presets"
              sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
            >
              {datePresets.map((option) => (
                <Chip
                  key={option.label}
                  label={option.label}
                  color={preset === option ? 'primary' : 'default'}
                  variant={preset === option ? 'filled' : 'outlined'}
                  aria-pressed={preset === option}
                  onClick={() => {
                    setSelection(option.days);
                    setAnchor(null);
                  }}
                />
              ))}
            </Box>
            <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={navigator.language}>
              <DatePicker
                label="Start date"
                timezone="UTC"
                value={draft.start_date}
                onChange={(date) => setDraft({ ...draft, start_date: date })}
                minDate={DateTime.utc(1, 1, 1)}
                maxDate={draft.end_date?.isValid ? draft.end_date : DateTime.utc(9999, 12, 31)}
                slotProps={{ textField: () => ({ required: true, fullWidth: true }) }}
              />
              <DatePicker
                label="End date"
                timezone="UTC"
                value={draft.end_date}
                onChange={(date) => setDraft({ ...draft, end_date: date })}
                minDate={draft.start_date?.isValid ? draft.start_date : DateTime.utc(1, 1, 1)}
                maxDate={DateTime.utc(9999, 12, 31)}
                slotProps={{ textField: () => ({ required: true, fullWidth: true }) }}
              />
            </LocalizationProvider>
            {!validRange && (
              <Typography color="error" variant="caption" role="alert">
                Enter valid dates with the start on or before the end.
              </Typography>
            )}
            <Stack direction="row" sx={{ justifyContent: 'flex-end', gap: 1 }}>
              <Button color="inherit" onClick={() => setAnchor(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={!validRange}>
                Apply
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 1 }}
          action={
            <Button color="inherit" onClick={() => void refetch()} disabled={isFetching}>
              Retry
            </Button>
          }
        >
          Unable to load the overview.{' '}
          {data ? 'Showing the last successful update.' : 'Please try again.'}
        </Alert>
      )}
      <Box aria-busy={isFetching}>
        {isPending ? <OverviewSkeleton /> : data && <OverviewContent data={data} />}
      </Box>
    </Container>
  );
}
