import { useTheme } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function PasswordStrengthMeter({ score = 0 }: { score: number }) {
  const isMobile = useIsMobile();
  const {
    palette: { error, success, warning },
  } = useTheme();

  return (
    <Stack
      direction="row"
      id="password-strength"
      aria-label={`Password strength is ${score} out of 4`}
      sx={{
        gap: isMobile ? 1 : 2,
        flexGrow: 2,
        width: '100%',
      }}
    >
      <PasswordStrengthMeterBar active={score >= 1} color={error.main} />
      <PasswordStrengthMeterBar active={score >= 2} color={warning.main} />
      <PasswordStrengthMeterBar active={score >= 3} color={success.main} />
      <PasswordStrengthMeterBar active={score >= 4} color={success.main} />
    </Stack>
  );
}

function PasswordStrengthMeterBar({ active, color }: { active: boolean; color: string }) {
  return (
    <Box
      sx={(theme) => ({
        height: 8,
        borderRadius: theme.shape.borderRadius,
        width: '100%',
        backgroundColor: active ? color : theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
      })}
    ></Box>
  );
}
