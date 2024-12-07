import { useToken } from '../../hooks/useToken';
import { Navigate } from 'react-router';
import { useEffect } from 'react';
import { clearQueryClientChannel } from '../../App';

export default function Logout() {
  const { removeTokens } = useToken();

  useEffect(() => {
    removeTokens();
    const channel = new BroadcastChannel(clearQueryClientChannel.name);
    channel.postMessage(clearQueryClientChannel.message);
    channel.close();
  }, [removeTokens]);

  return <Navigate to={'/'} replace />;
}
