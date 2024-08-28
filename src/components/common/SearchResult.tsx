import { Grid, ListItem, Typography } from '@mui/material';

type SearchResultProps = {
  title: string;
  subtitle?: string;
  imageUrl: string | null;
};

export default function SearchResult({ title, subtitle, imageUrl, ...rest }: SearchResultProps) {
  return (
    <ListItem {...rest}>
      {imageUrl ? (
        <Grid
          container
          width="50px"
          height="100%"
          sx={(theme) => ({
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            marginRight: 1,
            ...theme.applyStyles('dark', {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }),
          })}
        >
          <img
            draggable="false"
            loading={'lazy'}
            alt="Book cover"
            referrerPolicy="no-referrer"
            src={imageUrl}
            width="50px"
            height="100%"
            style={{ objectFit: 'cover', aspectRatio: 0.7, borderRadius: 2 }}
          />
        </Grid>
      ) : null}
      <Grid item zeroMinWidth>
        <Typography noWrap variant="body1" sx={{ minWidth: '5em' }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography noWrap variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Grid>
    </ListItem>
  );
}
