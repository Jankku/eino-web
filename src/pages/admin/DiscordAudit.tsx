import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Stack,
  Switch,
  Typography,
  capitalize,
} from '@mui/material';
import { HTTPError } from 'ky';
import Head from '../../components/common/Head';
import {
  DiscordAuditSettings,
  useDiscordAudit,
  useUpdateDiscordAudit,
} from '../../data/admin/useDiscordAudit';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { errorSchema } from '../../utils/zodUtil';
import { underscoreToSpace } from '../../utils/stringUtil';
import { dateValueFormatter } from '../../utils/tableUtils';

function errorMessage(error: unknown) {
  const parsed = errorSchema.safeParse(error instanceof HTTPError ? error.data : error);
  return parsed.success && parsed.data.errors.length
    ? parsed.data.errors.map(({ message }) => message).join(' · ')
    : 'Something went wrong. Please try again.';
}

const actionLabel = (action: string) => {
  // Keep the backend's historical spelling out of the readable label.
  if (action === 'password_reseted') return 'Password reset';
  return capitalize(underscoreToSpace(action));
};

export default function DiscordAudit() {
  const query = useDiscordAudit();
  const update = useUpdateDiscordAudit();
  const { showSuccessSnackbar } = useCustomSnackbar();
  const [draft, setDraft] = useState<DiscordAuditSettings | null>(null);
  const status = query.data;
  const settings = draft ?? status;
  const actionsChanged =
    !!status &&
    !!settings &&
    (settings.actions.length !== status.actions.length ||
      settings.actions.some((action) => !status.actions.includes(action)));
  const dirty = !!status && !!settings && (settings.enabled !== status.enabled || actionsChanged);
  const saving = update.isPending;

  useEffect(() => {
    if (!dirty && !saving) return;
    const preventUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', preventUnload);
    return () => window.removeEventListener('beforeunload', preventUnload);
  }, [dirty, saving]);

  const edit = (next: DiscordAuditSettings) => {
    update.reset();
    setDraft(next);
  };

  const save = () => {
    if (
      !status ||
      !settings ||
      !dirty ||
      saving ||
      (settings.enabled && !status.enabled && !status.webhook_configured)
    )
      return;
    // Send only changed properties, so action edits do not toggle delivery.
    const changes: Partial<DiscordAuditSettings> = {};
    if (settings.enabled !== status.enabled) changes.enabled = settings.enabled;
    if (actionsChanged) changes.actions = settings.actions;
    update.mutate(changes, {
      onSuccess: () => {
        setDraft(null);
        showSuccessSnackbar('Discord audit settings saved');
      },
    });
  };

  return (
    <Container maxWidth="md" sx={{ pb: 4 }}>
      <Head pageTitle="Discord audit" />
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <h1>Discord audit</h1>
        <Button
          onClick={() => void query.refetch()}
          disabled={query.isFetching || dirty || saving}
          loading={query.isFetching && !query.isPending}
        >
          Refresh status
        </Button>
      </Stack>
      <Stack spacing={2}>
        <Typography color="text.secondary">
          Forward selected new audit events to Discord.
        </Typography>
        {query.isPending && (
          <Stack role="status" sx={{ alignItems: 'center', gap: 2, py: 4 }}>
            <CircularProgress aria-label="Loading Discord audit settings" />
            <Typography>Loading Discord audit settings…</Typography>
          </Stack>
        )}
        {query.isError && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                onClick={() => void query.refetch()}
                disabled={query.isFetching || saving}
              >
                Retry
              </Button>
            }
          >
            Could not refresh Discord audit settings. {errorMessage(query.error)}
            {status && ' Previously loaded status is shown.'}
          </Alert>
        )}
        {status && settings && (
          <>
            <Paper
              component="section"
              variant="outlined"
              sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
              aria-labelledby="discord-status-title"
            >
              <Typography id="discord-status-title" component="h2" variant="h6" sx={{ mb: 2 }}>
                Delivery status
              </Typography>
              <Box
                component="dl"
                sx={{
                  m: 0,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' },
                  gap: 1,
                  '& dd': { m: 0, mb: { xs: 1, sm: 0 }, overflowWrap: 'anywhere' },
                }}
              >
                <Typography component="dt">Current status</Typography>
                <Box component="dd">
                  <Chip
                    size="small"
                    label={status.enabled ? 'Enabled' : 'Disabled'}
                    color={status.enabled ? 'success' : 'default'}
                  />
                </Box>
                <Typography component="dt">Webhook</Typography>
                <Typography component="dd">
                  {status.webhook_configured ? 'Configured' : 'Missing'}
                </Typography>
                <Typography component="dt">Pending deliveries</Typography>
                <Typography component="dd">{status.pending_count.toLocaleString()}</Typography>
                <Typography component="dt">Last successful delivery</Typography>
                <Typography component="dd">
                  {status.last_success_on ? (
                    <time dateTime={status.last_success_on}>
                      {dateValueFormatter(status.last_success_on)?.toString()}
                    </time>
                  ) : (
                    'No successful deliveries yet'
                  )}
                </Typography>
                <Typography component="dt">Latest error</Typography>
                <Typography component="dd" sx={{ whiteSpace: 'pre-wrap' }}>
                  {status.last_error || 'No delivery error recorded'}
                </Typography>
              </Box>
            </Paper>
            <Paper
              component="form"
              variant="outlined"
              onSubmit={(event) => {
                event.preventDefault();
                save();
              }}
              aria-labelledby="discord-settings-title"
              aria-busy={saving}
              sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
            >
              <Stack spacing={2}>
                <Typography id="discord-settings-title" component="h2" variant="h6">
                  Forwarding settings
                </Typography>
                {!status.webhook_configured && (
                  <Alert severity="warning" id="discord-webhook-warning">
                    Enabling requires a Discord webhook URL in the backend environment
                    configuration. You can still change selected action types.
                  </Alert>
                )}
                <FormControlLabel
                  label="Enable Discord audit forwarding"
                  control={
                    <Switch
                      checked={settings.enabled}
                      disabled={saving || (!status.webhook_configured && !settings.enabled)}
                      slotProps={{
                        input: {
                          'aria-describedby': !status.webhook_configured
                            ? 'discord-webhook-warning'
                            : undefined,
                        },
                      }}
                      onChange={(_, enabled) => edit({ ...settings, enabled })}
                    />
                  }
                />
                <Alert severity="info">
                  Only new events are forwarded. Disabling discards pending deliveries and skips
                  events while disabled. Changing action types preserves already queued events.
                  Settings and the remaining queue survive backend restarts. Each delivery has one
                  attempt, with no retries.
                </Alert>
                <FormControl component="fieldset" disabled={saving} sx={{ minWidth: 0 }}>
                  <FormLabel component="legend">Action types</FormLabel>
                  <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                    <Button
                      size="small"
                      disabled={
                        saving ||
                        status.available_actions.every((action) =>
                          settings.actions.includes(action),
                        )
                      }
                      onClick={() => edit({ ...settings, actions: [...status.available_actions] })}
                    >
                      Select all
                    </Button>
                    <Button
                      size="small"
                      disabled={saving || !settings.actions.length}
                      onClick={() => edit({ ...settings, actions: [] })}
                    >
                      Clear selection
                    </Button>
                  </Stack>
                  <FormGroup
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                    }}
                  >
                    {status.available_actions.map((action) => (
                      <FormControlLabel
                        key={action}
                        sx={{
                          alignItems: 'flex-start',
                          '& .MuiFormControlLabel-label': {
                            pt: 0.5,
                            overflowWrap: 'anywhere',
                            minWidth: 0,
                          },
                        }}
                        label={actionLabel(action)}
                        control={
                          <Checkbox
                            size="small"
                            sx={{ py: 0.5 }}
                            checked={settings.actions.includes(action)}
                            disabled={saving}
                            onChange={(_, checked) =>
                              edit({
                                ...settings,
                                actions: checked
                                  ? [...settings.actions, action]
                                  : settings.actions.filter((value) => value !== action),
                              })
                            }
                          />
                        }
                      />
                    ))}
                  </FormGroup>
                  {!status.available_actions.length && (
                    <Typography color="text.secondary">No action types available.</Typography>
                  )}
                </FormControl>
                {status.enabled && !settings.enabled && (
                  <Alert severity="warning">
                    Saving will discard pending deliveries. Events that occur while disabled are
                    skipped. An in-flight request can still finish.
                  </Alert>
                )}
                {update.isError && (
                  <Alert severity="error">
                    Could not save Discord audit settings. {errorMessage(update.error)}
                  </Alert>
                )}
                <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    loading={saving}
                    disabled={
                      !dirty || (settings.enabled && !status.enabled && !status.webhook_configured)
                    }
                  >
                    Save settings
                  </Button>
                  <Button
                    disabled={!dirty || saving}
                    onClick={() => {
                      setDraft(null);
                      update.reset();
                    }}
                  >
                    Discard changes
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </>
        )}
      </Stack>
    </Container>
  );
}
