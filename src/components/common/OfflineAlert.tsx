import { Alert, Collapse } from '@mui/material';
import { onlineManager } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type OfflineAlertProps = {
  drawerWidth: number;
};

export default function OfflineAlert({ drawerWidth }: OfflineAlertProps) {
  const [isOnline, setIsOnline] = useState<boolean>();
  const isVisible = isOnline !== undefined && !isOnline;

  useEffect(() => {
    onlineManager.subscribe(() => {
      setIsOnline(onlineManager.isOnline());
    });
  }, []);

  return (
    <Collapse
      in={isVisible}
      sx={{ width: `calc(100% - ${drawerWidth}px)`, marginLeft: `${drawerWidth}px` }}
    >
      <Alert
        variant="filled"
        severity="warning"
        sx={{
          justifyContent: 'center',
        }}
      >
        No network connection
      </Alert>
    </Collapse>
  );
}
