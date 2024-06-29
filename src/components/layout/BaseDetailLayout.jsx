import { Box, Card, CardActions, CardContent, Container, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BaseDetailLayout({ imageUrl, details, children, actions }) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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
            <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute' }}>
              <ArrowBackIcon />
            </IconButton>
          ) : null}
          <Grid container justifyContent="center" flexWrap="wrap">
            {imageUrl ? (
              <Grid
                container
                item
                zeroMinWidth
                flexShrink={2}
                mb={{ xs: 1, md: 0 }}
                sx={(theme) => ({
                  maxWidth: isMobile ? '50%' : '40%',
                  aspectRatio: 0.7,
                  borderRadius: 1,
                  boxShadow: theme.palette.mode === 'light' && theme.shadows[4],
                })}
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
              alignSelf="start"
              pl={2}
              pt={imageUrl ? 1 : isMobile ? 6 : 1}
              columns={1}
            >
              <Box component="dl" aria-label="Book details" maxWidth="100%" m={0}>
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
