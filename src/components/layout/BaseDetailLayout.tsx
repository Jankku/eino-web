import { Box, Card, CardActions, CardContent, Container, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router';
import { useIsMobile } from '../../hooks/useIsMobile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type BaseDetailLayoutProps = {
  backButtonDefaultUrl: string;
  imageUrl: string | null;
  details: React.ReactNode;
  children: React.ReactNode;
  actions: React.ReactNode;
};

export default function BaseDetailLayout({
  backButtonDefaultUrl,
  imageUrl,
  details,
  children,
  actions,
}: BaseDetailLayoutProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const onBackButtonClick = () => {
    const canGoBack = window.history.state.idx !== 0;
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(backButtonDefaultUrl);
    }
  };

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
        <CardContent sx={{ pb: 0 }}>
          {isMobile ? (
            <IconButton onClick={onBackButtonClick} sx={{ position: 'absolute' }}>
              <ArrowBackIcon />
            </IconButton>
          ) : null}
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
          <Grid container>{actions}</Grid>
        </CardActions>
      </Card>
      {children}
    </Container>
  );
}
