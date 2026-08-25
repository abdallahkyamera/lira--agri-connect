

// const API_ROOT = (
//   import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
// ).replace(/\/api\/?$/, '');

// export const getMediaUrl = (mediaPath) => {
//   if (!mediaPath) return null;

//   if (
//     mediaPath.startsWith('http://') ||
//     mediaPath.startsWith('https://')
//   ) {
//     return mediaPath;
//   }

//   if (mediaPath.startsWith('/')) {
//     return `${API_ROOT}${mediaPath}`;
//   }

//   return `${API_ROOT}/media/${mediaPath}`;
// };


const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const getMediaBaseUrl = () => {
  return API_BASE_URL.replace(/\/api\/?$/, '');
};

export const getMediaUrl = (mediaPath) => {
  if (!mediaPath) return null;

  if (
    mediaPath.startsWith('http://') ||
    mediaPath.startsWith('https://')
  ) {
    return mediaPath;
  }

  const baseUrl = getMediaBaseUrl();

  if (mediaPath.startsWith('/')) {
    return `${baseUrl}${mediaPath}`;
  }

  return `${baseUrl}/media/${mediaPath}`;
};