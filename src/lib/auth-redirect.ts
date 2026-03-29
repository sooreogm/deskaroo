export const LOGIN_REDIRECT_PARAM = 'redirectTo';

export const getSafeRedirectTarget = (value: string | null | undefined, fallback = '/dashboard') => {
  if (!value) {
    return fallback;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue.startsWith('/') || normalizedValue.startsWith('//')) {
    return fallback;
  }

  try {
    const parsedUrl = new URL(normalizedValue, 'http://localhost');
    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return fallback;
  }
};
