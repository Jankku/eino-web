export const getShareUrl = (shareId) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  return new URL(`api/v1/share/${shareId}`, baseUrl).toString();
};

export const blobToBase64 = async (image) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = (r) => resolve(r.target.result);
  });
};
