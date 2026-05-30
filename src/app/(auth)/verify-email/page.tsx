'use client';

import { useVerifyEmail, useResendOtp } from '@/hooks/useAuth';
import { useForm } from '@tanstack/react-form';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Loader2, Mail } from 'lucide-react';
import AuthShell from '@/components/auth/auth-shell';
import {
  authBtnPrimary,
  authFieldClass,
  authInputClass,
  authLabelClass,
} from '@/components/auth/auth-ui';
import { cn } from '@/lib/utils';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { mutate: verify, isPending, error } = useVerifyEmail();
  const { mutate: resend, isPending: isResending, isSuccess: resendSuccess } = useResendOtp();

  useEffect(() => {
    if (countdown === 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const form = useForm({
    defaultValues: { otp: '' },
    onSubmit: ({ value }) => {
      verify({ email, otp: value.otp });
    },
  });

  const handleResend = () => {
    resend(
      { email, purpose: 'verification' },
      {
        onSuccess: () => {
          setCountdown(60);
          setCanResend(false);
        },
      },
    );
  };

  return (
    <AuthShell title="Verify email" subtitle="Enter the 6-digit code we sent you">
      <div className="flex items-center gap-2.5 bg-purple-50 rounded-lg p-2.5 mb-3">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
          <Mail size={14} className="text-purple-600" />
        </div>
        <div>
          <p className="text-gray-500 text-[10px]">OTP sent to</p>
          <p className="text-purple-900 text-xs font-medium truncate">{email}</p>
        </div>
      </div>

      {resendSuccess && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-3">
          <p className="text-purple-700 text-xs text-center">New OTP sent</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
          <p className="text-red-600 text-xs text-center">
            {(error as any)?.response?.data?.message ?? 'Invalid or expired OTP'}
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
              <label className={cn(authLabelClass, 'text-center block')}>
                6-digit OTP
              </label>
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

        <button type="submit" disabled={isPending} className={authBtnPrimary}>
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? 'Verifying...' : 'Verify Email'}
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
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
