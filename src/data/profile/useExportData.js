import { useMutation } from '@tanstack/react-query';
import axios from '../axios';

const exportDataQuery = async (password) => {
  const res = await axios({
    method: 'POST',
    url: '/profile/export',
    data: { password },
  });
  return res.data;
};

export const useExportData = () =>
  useMutation({
    useErrorBoundary: false,
    mutationFn: (userPassword) => exportDataQuery(userPassword),
  });
