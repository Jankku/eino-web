import axios from './axios';

const getProfile = async () => {
  const res = await axios({
    method: 'GET',
    url: '/profile',
  });
  return res.data;
};

const shareProfile = async () => {
  const res = await axios({
    method: 'GET',
    url: '/profile/share',
  });
  return res.data.results[0].share_id;
};

const getShareImage = async (shareId) => {
  const res = await axios({
    method: 'GET',
    url: `/share/${shareId}`,
    responseType: 'blob',
    headers: { 'Content-Type': 'image/png' },
  });
  return res.data;
};

const deleteAccount = async (password) => {
  const res = await axios({
    method: 'POST',
    url: '/profile/deleteaccount',
    data: { password },
  });
  return res.data;
};

export { getProfile, shareProfile, getShareImage, deleteAccount };
