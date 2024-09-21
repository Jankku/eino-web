export const statusColors = {
  reading: '#3a73Df',
  watching: '#3a73Df',
  completed: '#43a44a',
  'on-hold': '#c5a200',
  dropped: '#d33641',
  planned: '#858585',
};

export const getProfilePictureUrl = (path: string | null | undefined) => {
  if (!path) return undefined;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  if (!URL.canParse(`api/v2/${path}`, baseUrl)) return undefined;
  return new URL(`api/v2/${path}`, baseUrl).toString();
};
