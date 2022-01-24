import axios from './axios';

const ProfileController = {
  async getProfile() {
    return await axios({
      method: 'GET',
      url: '/api/profile',
    });
  },
};

export default ProfileController;
