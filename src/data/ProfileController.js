import axios from './axios';

const ProfileController = {
  async getProfile() {
    return await axios({
      method: 'GET',
      url: '/api/profile',
    });
  },

  async deleteAccount(password) {
    return await axios({
      method: 'POST',
      url: '/api/profile/deleteaccount',
      data: { password },
    });
  },
};

export default ProfileController;
