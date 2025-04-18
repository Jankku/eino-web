import { GridLegacy, ListItem, Typography } from '@mui/material';

type SearchResultProps = {
  title: string;
  subtitle?: string;
  imageUrl: string | null;
};

export default function SearchResult({ title, subtitle, imageUrl, ...rest }: SearchResultProps) {
  return (
    <ListItem {...rest}>
      {imageUrl ? (
        <GridLegacy
          container
          sx={[
            {
              width: '50px',
              height: '100%',
            },
            (theme) => ({
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              marginRight: 1,
              ...theme.applyStyles('dark', {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }),
            }),
          ]}
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
        </GridLegacy>
      ) : null}
      <GridLegacy item zeroMinWidth>
        <Typography noWrap variant="body1" sx={{ minWidth: '5em' }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            noWrap
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {subtitle}
          </Typography>
        ) : null}
      </GridLegacy>
    </ListItem>
  );
}
