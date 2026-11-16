import { Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function ScoreChip({ score }: { score: number }) {
  return (
    <Chip
      icon={<StarIcon color="inherit" sx={{ width: 22 }} />}
      label={score}
      sx={(theme) => ({
        backgroundColor: 'transparent',
        fontWeight: 500,
        color: score > 0 ? theme.vars.palette.primary.dark : theme.vars.palette.text.primary,
        ...theme.applyStyles('dark', {
          color: score > 0 ? theme.vars.palette.primary.light : theme.vars.palette.text.primary,
        }),
      })}
    />
  );
}
