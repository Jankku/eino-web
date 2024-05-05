import { Box } from '@mui/system';
import { Card, CardContent, Grid, Typography } from '@mui/material';

export default function InfoCard({ title, icon, children }) {
  return (
    <Card
      component="section"
      sx={{
        padding: '0.2em',
        border: 1,
        borderColor: 'primary.main',
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Grid
          container
          sx={{
            marginBottom: '0.3em',
            alignItems: 'center',
          }}
        >
          <Grid item>
            <Box
              sx={{
                marginRight: '0.5em',
                height: '24px',
              }}
            >
              {icon}
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="h6">{title}</Typography>
          </Grid>
        </Grid>

        {children}
      </CardContent>
    </Card>
  );
}
