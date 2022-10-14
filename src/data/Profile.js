import axios from './axios';

const getProfile = async () => {
  const res = await axios({
    method: 'GET',
    url: '/api/profile',
  });
  return res.data;
};

const deleteAccount = async (password) => {
  const res = await axios({
    method: 'POST',
    url: '/api/profile/deleteaccount',
    data: { password },
  });
  return res.data;
};

export { getProfile, deleteAccount };
