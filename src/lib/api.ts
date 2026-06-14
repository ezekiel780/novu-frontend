import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor ───────────────────
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response Interceptor ──────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // ── Public routes — never refresh ─────
    const publicRoutes = [
      '/auth/register',
      '/auth/login',
      '/auth/verify-email',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/resend-otp',
      '/auth/refresh',
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      original?.url?.includes(route),
    );

    // ── Only refresh on protected routes ──
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isPublicRoute
    ) {
      original._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');

        if (!refreshToken) {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
        );

        Cookies.set('accessToken', data.accessToken, { expires: 1 });
        Cookies.set('refreshToken', data.refreshToken, { expires: 7 });

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
