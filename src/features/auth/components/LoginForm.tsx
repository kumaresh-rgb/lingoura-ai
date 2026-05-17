'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { loginSchema, type LoginInput } from '../schemas/auth.schemas';
import { useLogin } from '../hooks/useLogin';
import { parseApiError, extractFieldErrors } from '@/shared/api/error-handler';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/constants/routes';
import { GoogleOAuthButton } from './GoogleOAuthButton';

const inputBase =
  'w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-150 ' +
  'bg-slate-800/60 border text-slate-100 placeholder:text-slate-500 ' +
  'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500';

const OAUTH_ERRORS: Record<string, string> = {
  oauth_failed:   'Google sign-in failed. Please try again.',
  no_code:        'Google did not return an authorization code. Please try again.',
  access_denied:  'Google sign-in was cancelled.',
};

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-400 ml-0.5 mt-0.5" role="alert">
      {message}
    </p>
  );
}

export function LoginForm() {
  const login = useLogin();
  const searchParams = useSearchParams();

  // OAuth redirect error (e.g. ?error=oauth_failed)
  const oauthErrorKey = searchParams.get('error');
  const oauthError = oauthErrorKey
    ? (OAUTH_ERRORS[oauthErrorKey] ?? 'Sign-in failed. Please try again.')
    : null;

  // API / server errors
  const apiError = login.error ? parseApiError(login.error) : null;
  // 401 = wrong credentials — never put on individual fields (prevents email enumeration)
  const serverFields = apiError?.errors?.length && apiError.status !== 401
    ? extractFieldErrors(apiError.errors)
    : {};
  const hasFieldErrors = Object.keys(serverFields).length > 0;

  let globalError: string | null = null;
  if (apiError) {
    if (apiError.status === 401) {
      globalError = 'Invalid email or password.';
    } else if (!hasFieldErrors) {
      // No fields could be mapped — surface the backend validation details verbatim
      // so both the user and developer can see exactly what the backend rejected
      globalError = apiError.errors?.length
        ? apiError.errors.map(e => {
            const colonIdx = e.indexOf(':');
            return colonIdx !== -1 ? e.substring(colonIdx + 1).trim() : e;
          }).join('\n')
        : apiError.message;
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const isPending = login.isPending || isSubmitting;

  function errCls(hasError: boolean) {
    return cn(inputBase, hasError ? 'border-red-500/60' : 'border-white/10');
  }

  return (
    <form onSubmit={handleSubmit((d) => login.mutate(d))} noValidate className="space-y-4">

      {/* OAuth error banner (amber) */}
      <AnimatePresence mode="wait">
        {oauthError && !apiError && (
          <motion.div
            key="oauth-err"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium"
            role="alert"
          >
            {oauthError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* API error banner (red) */}
      <AnimatePresence mode="wait">
        {globalError && (
          <motion.div
            key="api-err"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium space-y-1"
            role="alert"
          >
            {globalError.includes('\n')
              ? globalError.split('\n').map((line, i) => <p key={i}>{line}</p>)
              : globalError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">
          Email Address
        </label>
        <div className="relative">
          <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            {...register('email')}
            aria-invalid={!!(errors.email || serverFields.email)}
            className={errCls(!!(errors.email || serverFields.email))}
          />
        </div>
        <FieldError message={errors.email?.message ?? serverFields.email} />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center ml-0.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Password
          </label>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
          >
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register('password')}
            aria-invalid={!!(errors.password || serverFields.password)}
            className={errCls(!!(errors.password || serverFields.password))}
          />
        </div>
        <FieldError message={errors.password?.message ?? serverFields.password} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-150 flex items-center justify-center gap-2',
          'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
        )}
      >
        {isPending
          ? <><Loader2 size={15} className="animate-spin" /> Signing in…</>
          : <>Sign In <ArrowRight size={15} /></>}
      </button>

      {/* Divider */}
      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-slate-600 font-medium shrink-0">or continue with</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      <GoogleOAuthButton />

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <Link href={ROUTES.REGISTER} className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
          Sign up free
        </Link>
      </p>
    </form>
  );
}
