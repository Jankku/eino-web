import { Alert, AlertTitle, Box, Button, Collapse, useMediaQuery, useTheme } from '@mui/material';
import { useBulletins } from '../../data/bulletins/useBulletins';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router';
import { BulletinCondition } from '../../models/bulletin';

const conditionsWithAction: BulletinCondition[] = ['2fa_not_enabled', 'email_not_verified'];

type BulletinsProps = {
  drawerWidth: number;
};

export default function Bulletins({ drawerWidth }: BulletinsProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();
  const theme = useTheme();
  const isSmOrLarger = useMediaQuery(theme.breakpoints.up('sm'));
  const isLgOrSmaller = useMediaQuery(theme.breakpoints.down('xl'));
  const { data } = useBulletins({ loggedIn: isLoggedIn });
  const [closedBulletins, setClosedBulletins] = useLocalStorage<string[]>('closedBulletins', []);
  const bulletinsToShow = data?.filter(({ id }) => !closedBulletins.includes(id)) || [];

  const closeBulletin = (id: string) => {
    setClosedBulletins((old) => [...old, id]);
  };

  const handleBulletinAction = async (id: string) => {
    await navigate('/profile');
    closeBulletin(id);
  };

  return (
    <Collapse
      in={bulletinsToShow.length > 0}
      sx={
        isLgOrSmaller
          ? undefined
          : { width: `calc(100% - ${drawerWidth}px)`, marginLeft: `${drawerWidth}px` }
      }
    >
      {bulletinsToShow?.map(({ id, title, message, condition, type }) => (
        <Alert
          key={id}
          severity={type}
          variant="filled"
          action={
            condition && conditionsWithAction.includes(condition as BulletinCondition) ? (
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1 }}>
                {isSmOrLarger ? (
                  <Button color="inherit" size="small" onClick={() => closeBulletin(id)}>
                    Dismiss
                  </Button>
                ) : undefined}
                <Button color="inherit" size="small" onClick={() => handleBulletinAction(id)}>
                  Go to profile
                </Button>
              </Box>
            ) : undefined
          }
          onClose={() => closeBulletin(id)}
          sx={{
            '&.MuiAlert-filled.MuiAlert-colorInfo': {
              ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.background.default,
              }),
            },
          }}
        >
          {title && message ? (
            <>
              <AlertTitle>{title}</AlertTitle>
              {message}
            </>
          ) : (
            <>{title}</>
          )}
        </Alert>
      ))}
    </Collapse>
  );
}
