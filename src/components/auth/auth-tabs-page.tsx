'use client';

import { useLogin, useRegister } from '@/hooks/useAuth';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState, Suspense } from 'react';
import AuthShell from './auth-shell';
import {
  authBtnPrimary,
  authFieldClass,
  authInputClass,
  authLabelClass,
} from './auth-ui';
import { cn } from '@/lib/utils';

type AuthTab = 'login' | 'register';

function LoginFields({
  emailParam,
  verified,
  reset,
  error,
  isPending,
  onSubmit,
}: {
  emailParam: string;
  verified: boolean;
  reset: boolean;
  error: unknown;
  isPending: boolean;
  onSubmit: (values: { email: string; password: string }) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: { email: emailParam, password: '' },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <>
      {verified && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 mb-3">
          <p className="text-purple-700 text-xs text-center">
            Email verified — please sign in
          </p>
        </div>
      )}

      {reset && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 mb-3">
          <p className="text-purple-700 text-xs text-center">
            Password reset — please sign in
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mb-3">
          <p className="text-red-600 text-xs">
            {(error as any)?.response?.data?.message ?? 'Invalid email or password'}
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

        <form.Field name="password">
          {(field) => (
            <div className={authFieldClass}>
              <div className="flex items-center justify-between">
                <label className={authLabelClass}>Password</label>
                <Link
                  href="/forgot-password"
                  className="text-purple-600 hover:text-purple-500 text-[11px]"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="••••••••"
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

        <button type="submit" disabled={isPending} className={authBtnPrimary}>
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </>
  );
}

function RegisterFields({
  error,
  isPending,
  onSubmit,
}: {
  error: unknown;
  isPending: boolean;
  onSubmit: (values: {
    displayName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mb-3">
          <p className="text-red-600 text-xs">
            {(error as any)?.response?.data?.message ?? 'Registration failed.'}
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
        <form.Field name="displayName">
          {(field) => (
            <div className={authFieldClass}>
              <label className={authLabelClass}>Full Name</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Your name"
                className={authInputClass}
              />
            </div>
          )}
        </form.Field>

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

        <form.Field name="password">
          {(field) => (
            <div className={authFieldClass}>
              <label className={authLabelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
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

        <form.Field name="phoneNumber">
          {(field) => (
            <div className={authFieldClass}>
              <label className={authLabelClass}>
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="2348012345678"
                className={authInputClass}
              />
            </div>
          )}
        </form.Field>

        <button type="submit" disabled={isPending} className={authBtnPrimary}>
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </>
  );
}

function AuthTabsPageContent({ defaultTab }: { defaultTab: AuthTab }) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab: AuthTab =
    tabParam === 'register' || defaultTab === 'register' ? 'register' : 'login';

  const [tab, setTab] = useState<AuthTab>(initialTab);

  const verified = searchParams.get('verified');
  const reset = searchParams.get('reset');
  const emailParam = searchParams.get('email') ?? '';

  const { mutate: login, isPending: isLoginPending, error: loginError } = useLogin();
  const {
    mutate: register,
    isPending: isRegisterPending,
    error: registerError,
  } = useRegister();

  return (
    <AuthShell
      title={tab === 'login' ? 'Welcome back' : 'Create account'}
      subtitle={
        tab === 'login'
          ? 'Sign in to continue'
          : 'Join Novu and start messaging'
      }
    >
      <div className="flex rounded-lg bg-purple-50 p-1 mb-4">
        {(['login', 'register'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              'flex-1 py-2 text-sm font-medium rounded-md transition',
              tab === item
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-500 hover:text-purple-600',
            )}
          >
            {item === 'login' ? 'Sign In' : 'Register'}
          </button>
        ))}
      </div>

      {tab === 'login' ? (
        <LoginFields
          emailParam={emailParam}
          verified={!!verified}
          reset={!!reset}
          error={loginError}
          isPending={isLoginPending}
          onSubmit={login}
        />
      ) : (
        <RegisterFields
          error={registerError}
          isPending={isRegisterPending}
          onSubmit={(value) =>
            register({
              ...value,
              phoneNumber: value.phoneNumber || undefined,
            })
          }
        />
      )}
    </AuthShell>
  );
}

export default function AuthTabsPage({ defaultTab = 'login' }: { defaultTab?: AuthTab }) {
  return (
    <Suspense>
      <AuthTabsPageContent defaultTab={defaultTab} />
    </Suspense>
  );
}
