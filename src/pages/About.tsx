import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Head from '../components/common/Head';
import licenses from '../../licenses.json';
import { DateTime } from 'luxon';

type Licenses = {
  [key: string]: {
    licenses: string;
    repository: string;
    publisher: string;
    url: string;
  };
};

const ensureHttps = (url: string) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};

const tableRows = Object.entries(licenses as unknown as Licenses).map(([pkg, obj]) => {
  return (
    <TableRow key={pkg}>
      <TableCell component="th" scope="row">
        <Typography variant="body2">
          {obj.repository ? (
            <Link href={ensureHttps(obj.repository)} rel="noreferrer">
              {pkg}
            </Link>
          ) : (
            pkg
          )}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2">{obj.licenses}</Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2">
          {obj.url ? (
            <Link href={ensureHttps(obj.url)} rel="noreferrer">
              {obj.publisher}
            </Link>
          ) : (
            obj.publisher
          )}
        </Typography>
      </TableCell>
    </TableRow>
  );
});

const privacyLastUpdated = DateTime.fromISO('2025-04-12T21:40:00+03:00').toLocaleString(
  DateTime.DATETIME_SHORT,
);

export default function About() {
  return (
    <Container maxWidth="sm" sx={{ paddingBottom: 4 }}>
      <Head pageTitle="About" />
      <Stack gap={2} pt={4}>
        <Card component="section">
          <CardContent>
            <Stack direction="column" alignItems="center" gap={1}>
              <Typography
                component={'h1'}
                sx={(theme) => ({
                  fontFamily: 'Pacifico, cursive',
                  fontSize: '64px',
                  color: theme.palette.common.black,
                  ...theme.applyStyles('dark', {
                    color: theme.palette.common.white,
                  }),
                })}
              >
                eino
              </Typography>
              <Typography component="p">
                Commit{' '}
                <Link href={`https://github.com/Jankku/eino-web/commit/${__COMMIT_HASH__}`}>
                  {__COMMIT_HASH__}
                </Link>
              </Typography>
              <Typography component="p">
                Made by{' '}
                <Link href="https://github.com/Jankku" rel="noreferrer">
                  Jankku
                </Link>{' '}
                ✨
              </Typography>
            </Stack>
          </CardContent>
        </Card>
        <Accordion
          disableGutters
          component="section"
          slotProps={{ heading: { component: 'h2' }, transition: { unmountOnExit: true } }}
        >
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Typography fontWeight="600">Privacy policy</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack gap={3}>
              <Typography component="p">Last updated: {privacyLastUpdated}</Typography>
              <Box>
                <Typography component="h3" fontWeight="500" mb={1}>
                  What data is collected?
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Username</li>
                  <li>Email (optional)</li>
                  <li>Encrypted password</li>
                  <li>Account creation date</li>
                  <li>User generated content</li>
                </Box>

                <Typography component="h3" fontWeight="500" mb={1}>
                  Analytics
                </Typography>
                <Typography component="p">
                  This website uses a self-hosted instance of Plausible Analytics, located in
                  Amsterdam, Netherlands. Plausible Analytics is designed to be privacy-friendly,
                  and it does not use cookies or track personal information. For more details on
                  what data is collected, please refer to{' '}
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
                <Typography component="h3" fontWeight="500" mb={1}>
                  Why do you collect this data?
                </Typography>
                <Typography component="p">
                  Simply to provide this service. Analytics data is collected because I&apos;m
                  interested in the numbers.
                </Typography>
              </Box>

              <Box>
                <Typography component="h3" fontWeight="500" mb={1}>
                  Does this website use cookies?
                </Typography>
                <Typography component="p">No, this website does not use cookies.</Typography>
              </Box>

              <Box>
                <Typography component="h3" fontWeight="500" mb={1}>
                  Do you share data with third parties?
                </Typography>
                <Typography component="p">
                  No, your data will never be shared with any third parties. Your data is used
                  solely for the purposes outlined in this policy.
                </Typography>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion
          disableGutters
          component="section"
          slotProps={{ heading: { component: 'h2' }, transition: { unmountOnExit: true } }}
        >
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Typography fontWeight="600">Licenses</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small">
              <TableBody>{tableRows}</TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Container>
  );
}
