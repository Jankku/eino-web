export const getShareUrl = (shareId: string | undefined) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  return new URL(`api/v2/share/${shareId}`, baseUrl).toString();
};
