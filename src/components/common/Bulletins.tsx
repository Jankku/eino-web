import { Alert, AlertTitle, Collapse, useMediaQuery, useTheme } from '@mui/material';
import { useBulletins } from '../../data/bulletins/useBulletins';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import { useLocalStorage } from '@uidotdev/usehooks';

type BulletinsProps = {
  drawerWidth: number;
};

export default function Bulletins({ drawerWidth }: BulletinsProps) {
  const { isLoggedIn } = useAuthContext();
  const theme = useTheme();
  const isLgOrSmaller = useMediaQuery(theme.breakpoints.down('xl'));
  const { data } = useBulletins({ loggedIn: isLoggedIn });
  const [closedBulletins, setClosedBulletins] = useLocalStorage<string[]>('closedBulletins', []);
  const bulletinsToShow = data?.filter(({ id }) => !closedBulletins.includes(id)) || [];

  const closeBulletin = (id: string) => {
    setClosedBulletins((old) => [...old, id]);
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
      {bulletinsToShow?.map(({ id, title, content }) => (
        <Alert
          key={id}
          severity="info"
          variant="filled"
          onClose={() => closeBulletin(id)}
          sx={{
            '&.MuiAlert-filled.MuiAlert-colorInfo': {
              backgroundColor: theme.palette.background.default,
            },
          }}
        >
          {title && content ? (
            <>
              <AlertTitle>{title}</AlertTitle>
              {content}
            </>
          ) : (
            <>{title}</>
          )}
        </Alert>
      ))}
    </Collapse>
  );
}
