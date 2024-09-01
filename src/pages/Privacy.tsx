import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';

export default function Privacy() {
  const lastUpdated = DateTime.fromISO('2024-09-01T00:00:00+03:00').toLocaleString(
    DateTime.DATE_SHORT,
  );

  return (
    <Container maxWidth="sm">
      <h1>Privacy Policy</h1>
      <Typography paragraph>Last updated: {lastUpdated}</Typography>

      <Stack>
        <Box>
          <h2>What data is collected?</h2>
          <Box component="ul" pl={2}>
            <li>Username</li>
            <li>Email (optional)</li>
            <li>Encrypted password</li>
            <li>Account creation date</li>
            <li>User generated content</li>
          </Box>

          <h3>Analytics data</h3>
          <Typography paragraph>
            This website uses a self-hosted instance of Plausible Analytics, located in Amsterdam,
            Netherlands. Plausible Analytics is designed to be privacy-friendly, and it does not use
            cookies or track personal information. For more details on what data is collected,
            please refer to{' '}
            <Link
              href="https://plausible.io/data-policy#first-thing-first-what-we-collect-and-what-we-use-it-for"
              rel="noreferrer"
            >
              Plausible&apos;s Data Policy
            </Link>
            .
          </Typography>
        </Box>

        <Box>
          <h2>Why do you collect data?</h2>
          <Typography paragraph>
            Simply to provide this service. Analytics data is collected because I&apos;m interested
            in the numbers.
          </Typography>
        </Box>

        <Box>
          <h2>Does this website use cookies?</h2>
          <Typography paragraph>No, this website does not use cookies.</Typography>
        </Box>

        <Box>
          <h2>Do you share data with third parties?</h2>
          <Typography paragraph>
            No, your data will never be shared with any third parties. Your data is used solely for
            the purposes outlined in this policy.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
