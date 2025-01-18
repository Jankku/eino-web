import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link, useLocation } from 'react-router';
import { useIsMobile } from '../../hooks/useIsMobile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useMemo } from 'react';

type BaseDetailLayoutProps = {
  imageUrl: string | null;
  details: React.ReactNode;
  children: React.ReactNode;
  actions: React.ReactNode;
  copyText: string;
  onCopy: () => void;
};

export default function BaseDetailLayout({
  imageUrl,
  details,
  children,
  actions,
  copyText,
  onCopy,
}: BaseDetailLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();

  const backUrl = useMemo(
    () => location.pathname.split('/').slice(0, -1).join('/') + location.search,
    [location],
  );

  return (
    <Container fixed disableGutters={!isMobile} maxWidth="sm">
      <Card
        component="section"
        sx={{
          my: 3,
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ pb: 0, position: 'relative' }}>
          {isMobile ? (
            <IconButton
              component={Link}
              to={backUrl}
              aria-label="Back"
              sx={{ position: 'absolute', left: 16 }}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : null}

          <Tooltip
            arrow
            title={<Typography variant="body2">{copyText}</Typography>}
            sx={{ position: 'absolute', right: 16 }}
          >
            <IconButton aria-label={copyText} onClick={onCopy}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Grid
            container
            sx={{
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {imageUrl ? (
              <Grid
                container
                item
                zeroMinWidth
                sx={[
                  {
                    flexShrink: 2,
                    mb: { xs: 1, md: 0 },
                  },
                  (theme) => ({
                    maxWidth: isMobile ? '50%' : '40%',
                    aspectRatio: 0.7,
                    borderRadius: 1,
                    boxShadow: theme.palette.mode === 'light' ? theme.shadows[4] : undefined,
                  }),
                ]}
              >
                <img
                  draggable="false"
                  alt="Book cover"
                  referrerPolicy="no-referrer"
                  src={imageUrl}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 'inherit',
                    objectFit: 'cover',
                    aspectRatio: 0.7,
                  }}
                />
              </Grid>
            ) : null}

            <Grid
              container
              item
              zeroMinWidth
              columns={1}
              sx={{
                alignSelf: 'start',
                pl: 2,
                pt: imageUrl ? 1 : isMobile ? 6 : 1,
              }}
            >
              <Box
                component="dl"
                aria-label="Book details"
                sx={{
                  maxWidth: '100%',
                  m: 0,
                }}
              >
                {details}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ m: 0, pt: 2, pl: 2, pb: 2 }}>
          <Grid container>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{actions}</Box>
          </Grid>
        </CardActions>
      </Card>
      {children}
    </Container>
  );
}
