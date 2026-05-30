import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import * as authApi from '@/lib/auth.api';
import {
  RegisterDto,
  VerifyEmailDto,
  LoginDto,
  ForgotPasswordDto,
  ResendOtpDto,
  ResetPasswordDto,
} from '@/types';
import Cookies from 'js-cookie';

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),
    onSuccess: (_, variables) => {
      router.push(
        `/verify-email?email=${encodeURIComponent(variables.email)}`,
      );
    },
  });
};

export const useVerifyEmail = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (dto: VerifyEmailDto) => authApi.verifyEmail(dto),
    onSuccess: (_, variables) => {
      router.push(
        `/login?verified=true&email=${encodeURIComponent(variables.email)}`,
      );
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push('/');
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      const refreshToken = Cookies.get('refreshToken') ?? '';
      return authApi.logout(refreshToken);
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },
  });
};

export const useForgotPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (dto: ForgotPasswordDto) => authApi.forgotPassword(dto),
    onSuccess: (_, variables) => {
      router.push(
        `/reset-password?email=${encodeURIComponent(variables.email)}`,
      );
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (dto: ResendOtpDto) => authApi.resendOtp(dto),
  });
};

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (dto: ResetPasswordDto) => authApi.resetPassword(dto),
    onSuccess: () => {
      router.push('/login?reset=true');
    },
  });
};
