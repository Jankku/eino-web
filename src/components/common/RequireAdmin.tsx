import { useToken } from '../../hooks/useToken';
import Error403 from '../errors/Error403';

type RequireAdminProps = {
  children: React.ReactNode;
};

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { getRole } = useToken();
  return getRole() === 'admin' ? children : <Error403 />;
}
