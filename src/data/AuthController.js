import axios from './axios';

const AuthController = {
  async register(credentials) {
    await axios({
      method: 'post',
      url: '/api/auth/register',
      data: {
        username: credentials.username,
        password: credentials.password,
        password2: credentials.password2,
      },
    });
  },

  async login(credentials) {
    return await axios({
      method: 'post',
      url: '/api/auth/login',
      data: credentials,
    });
  },
};

export default AuthController;
