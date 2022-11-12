import axios from './axios';

const registerUser = async (credentials) => {
  const res = await axios({
    method: 'post',
    url: '/auth/register',
    data: {
      username: credentials.username,
      password: credentials.password,
      password2: credentials.password2,
    },
  });
  return res.data;
};

const loginUser = async (credentials) => {
  const res = await axios({
    method: 'post',
    url: '/auth/login',
    data: credentials,
  });
  return res.data;
};

export { registerUser, loginUser };
