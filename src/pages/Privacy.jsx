import { Box, Container, Link, Typography } from '@mui/material';
import { DateTime } from 'luxon';

export default function Privacy() {
  const lastUpdated = DateTime.fromISO('2022-04-30T00:00:00+03:00').toLocaleString(
    DateTime.DATE_SHORT
  );

  return (
    <Container maxWidth="sm">
      <h1>Privacy Policy</h1>
      <Box>
        <Typography paragraph>Last updated: {lastUpdated}</Typography>
      </Box>

      <h2>What data is collected?</h2>
      <Typography paragraph>
        When you register, username, encrypted password and account creation date are collected. All
        user generated content is obviously saved.
      </Typography>

      <Typography paragraph>
        This website uses self-hosted instance of{' '}
        <Link href="https://plausible.io/" target="_blank" rel="noreferrer">
          Plausible
        </Link>{' '}
        analytics. The server is located in Amsterdam, Netherlands. This means your data will always
        stay inside EU. You can see what analytics data is collected on Plausible&apos;s{' '}
        <Link
          href="https://plausible.io/data-policy#first-thing-first-what-we-collect-and-what-we-use-it-for"
          target="_blank"
          rel="noreferrer"
        >
          data policy
        </Link>
        .
      </Typography>

      <h2>Why do you collect data?</h2>
      <Typography paragraph>
        Simply to provide this service. Analytics data is collected because I&apos;m interested in
        analytics numbers.
      </Typography>

      <h2>Does this website use cookies?</h2>
      <Typography paragraph>No.</Typography>

      <h2>Do you share data with third parties?</h2>
      <Typography paragraph>No, and never will.</Typography>
    </Container>
  );
}
