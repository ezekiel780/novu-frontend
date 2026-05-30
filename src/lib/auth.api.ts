import api from './api';
import {
  RegisterDto,
  RegisterResponse,
  VerifyEmailDto,
  LoginDto,
  ForgotPasswordDto,
  ResendOtpDto,
  ResetPasswordDto,
  AuthResponse,
} from '@/types';

export const register = async (dto: RegisterDto): Promise<RegisterResponse> => {
  const { data } = await api.post('/auth/register', dto);
  return data;
};

export const verifyEmail = async (
  dto: VerifyEmailDto,
): Promise<{ message: string }> => {
  const { data } = await api.post('/auth/verify-email', dto);
  return data;
};

export const login = async (dto: LoginDto): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', dto);
  return data;
};

export const refresh = async (
  refreshToken: string,
): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  return data;
};

export const logout = async (
  refreshToken: string,
): Promise<{ message: string }> => {
  const { data } = await api.post('/auth/logout', { refreshToken });
  return data;
};

export const forgotPassword = async (
  dto: ForgotPasswordDto,
): Promise<{ message: string }> => {
  const { data } = await api.post('/auth/forgot-password', dto);
  return data;
};

export const resendOtp = async (
  dto: ResendOtpDto,
): Promise<{ message: string }> => {
  const { data } = await api.post('/auth/resend-otp', dto);
  return data;
};

export const resetPassword = async (
  dto: ResetPasswordDto,
): Promise<{ message: string }> => {
  const { data } = await api.post('/auth/reset-password', dto);
  return data;
};
