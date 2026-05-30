'use client';

import { useForgotPassword } from '@/hooks/useAuth';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import AuthShell from '@/components/auth/auth-shell';
import {
  authBtnPrimary,
  authFieldClass,
  authInputClass,
  authLabelClass,
} from '@/components/auth/auth-ui';

export default function ForgotPasswordPage() {
  const {
    mutate: forgotPassword,
    isPending,
    error,
    isSuccess,
  } = useForgotPassword();

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: ({ value }) => {
      forgotPassword(value);
    },
  });

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email to receive a reset OTP"
    >
      {isSuccess ? (
        <div className="text-center py-2">
          <p className="text-purple-900 font-semibold text-sm mb-1">OTP sent!</p>
          <p className="text-gray-500 text-xs mb-4">
            Check your inbox and use the OTP to reset your password.
          </p>
          <Link href="/reset-password" className={authBtnPrimary}>
            Enter OTP
          </Link>
        </div>
      ) : (
        <>
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
            <form.Field name="email">
              {(field) => (
                <div className={authFieldClass}>
                  <label className={authLabelClass}>Email</label>
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="you@email.com"
                    className={authInputClass}
                  />
                </div>
              )}
            </form.Field>

            <button type="submit" disabled={isPending} className={authBtnPrimary}>
              {isPending && <Loader2 size={15} className="animate-spin" />}
              {isPending ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        </>
      )}

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-gray-500 hover:text-purple-600 text-xs mt-4 transition"
      >
        <ArrowLeft size={14} />
        Back to Sign In
      </Link>
    </AuthShell>
  );
}
