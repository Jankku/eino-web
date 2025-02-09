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
        color: score > 0 ? theme.palette.primary.dark : theme.palette.text.primary,
        ...theme.applyStyles('dark', {
          color: score > 0 ? theme.palette.primary.light : theme.palette.text.primary,
        }),
      })}
    />
  );
}
