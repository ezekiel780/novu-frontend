'use client';

import { useResetPassword, useResendOtp } from '@/hooks/useAuth';
import { useForm } from '@tanstack/react-form';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AuthShell from '@/components/auth/auth-shell';
import {
  authBtnPrimary,
  authFieldClass,
  authInputClass,
  authLabelClass,
} from '@/components/auth/auth-ui';
import { cn } from '@/lib/utils';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { mutate: resetPassword, isPending, error } = useResetPassword();
  const { mutate: resend, isPending: isResending } = useResendOtp();

  useEffect(() => {
    if (countdown === 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const form = useForm({
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      setPasswordError('');
      resetPassword({
        email,
        otp: value.otp,
        newPassword: value.newPassword,
      });
    },
  });

  const handleResend = () => {
    resend(
      { email, purpose: 'password-reset' },
      {
        onSuccess: () => {
          setCountdown(60);
          setCanResend(false);
        },
      },
    );
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle={`OTP sent to ${email || 'your email'}`}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mb-3">
          <p className="text-red-600 text-xs">
            {(error as any)?.response?.data?.message ?? 'Something went wrong'}
          </p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-3"
      >
        <form.Field name="otp">
          {(field) => (
            <div className={authFieldClass}>
              <label className={cn(authLabelClass, 'text-center block')}>OTP</label>
              <input
                value={field.state.value}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  field.handleChange(val);
                }}
                placeholder="000000"
                maxLength={6}
                className={cn(
                  authInputClass,
                  'text-center text-xl tracking-[0.4em] font-mono py-2.5',
                )}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="newPassword">
          {(field) => (
            <div className={authFieldClass}>
              <label className={authLabelClass}>New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Min. 8 characters"
                  className={cn(authInputClass, 'pr-9')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => (
            <div className={authFieldClass}>
              <label className={authLabelClass}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Repeat password"
                  className={cn(authInputClass, 'pr-9')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-[11px] mt-0.5">{passwordError}</p>
              )}
            </div>
          )}
        </form.Field>

        <button type="submit" disabled={isPending} className={authBtnPrimary}>
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div className="text-center mt-3">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-purple-600 hover:text-purple-500 text-xs font-medium flex items-center gap-1.5 mx-auto"
          >
            {isResending && <Loader2 size={13} className="animate-spin" />}
            {isResending ? 'Sending...' : 'Resend OTP'}
          </button>
        ) : (
          <p className="text-gray-500 text-xs">
            Resend in <span className="text-purple-600 font-medium">{countdown}s</span>
          </p>
        )}
      </div>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-gray-500 hover:text-purple-600 text-xs mt-3 transition"
      >
        <ArrowLeft size={14} />
        Back to Sign In
      </Link>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
