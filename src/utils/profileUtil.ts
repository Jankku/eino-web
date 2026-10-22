export const statusColors = {
  reading: '#3a73Df',
  watching: '#3a73Df',
  completed: '#43a44a',
  'on-hold': '#c5a200',
  dropped: '#d33641',
  planned: '#858585',
};

const watchTimeFormatter = new Intl.NumberFormat();

export const formatWatchTime = (totalHours: number) => {
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const formattedHours = `${watchTimeFormatter.format(hours)} ${hours === 1 ? 'hour' : 'hours'}`;
  if (days === 0) return formattedHours;
  const formattedDays = `${watchTimeFormatter.format(days)} ${days === 1 ? 'day' : 'days'}`;
  return hours === 0 ? formattedDays : `${formattedDays}, ${formattedHours}`;
};

export const getProfilePictureUrl = (path: string | null | undefined) => {
  if (!path) return undefined;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  if (!URL.canParse(`api/v2/${path}`, baseUrl)) return undefined;
  return new URL(`api/v2/${path}`, baseUrl).toString();
};
