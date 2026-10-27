import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const getFormData = (data: Blob) => {
  const formData = new FormData();
  formData.append('picture', data);
  return formData;
};

const uploadProfilePictureQuery = async (data: Blob) => {
  if (!(data instanceof Blob) || data.size === 0) {
    throw new Error('A non-empty picture is required for upload.');
  }

  const res = await api
    .post('api/v2/profile/profilepicture', {
      body: getFormData(data),
      timeout: 5000,
    })
    .json<ApiResponse<Result[]>>();
  return res.results[0];
};

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: uploadProfilePictureQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
