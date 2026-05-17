'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { registerSchema, type RegisterInput } from '../schemas/auth.schemas';
import { useRegister } from '../hooks/useRegister';
import { parseApiError, extractFieldErrors } from '@/shared/api/error-handler';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/constants/routes';
import { GoogleOAuthButton } from './GoogleOAuthButton';

// ─── Styles ──────────────────────────────────────────────────────────────────

const inputBase =
  'w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-150 ' +
  'bg-slate-800/60 border text-slate-100 placeholder:text-slate-500 ' +
  'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500';

const inputCompact =
  'w-full px-3 py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-150 ' +
  'bg-slate-800/60 border text-slate-100 placeholder:text-slate-500 ' +
  'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500';

const inputCompactWithIcon =
  'w-full pl-9 pr-3 py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-150 ' +
  'bg-slate-800/60 border text-slate-100 placeholder:text-slate-500 ' +
  'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500';

function errCls(base: string, hasError: boolean) {
  return cn(base, hasError ? 'border-red-500/60' : 'border-white/10');
}

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-400 ml-0.5 mt-0.5" role="alert">
      {message}
    </p>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterForm() {
  const register_ = useRegister();

  // Compute derived error state every render — no useEffect needed
  const apiError = register_.error ? parseApiError(register_.error) : null;
  const serverFields = apiError?.errors?.length
    ? extractFieldErrors(apiError.errors)
    : apiError?.status === 409
      ? { email: 'An account with this email already exists.' }
      : {};
  const globalError =
    apiError && Object.keys(serverFields).length === 0 ? apiError.message : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const isPending = register_.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit((d) => register_.mutate(d))} noValidate className="space-y-4">

      {/* Global error banner */}
      <AnimatePresence mode="wait">
        {globalError && (
          <motion.div
            key="global"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
            role="alert"
          >
            {globalError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* First Name + Last Name — side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* First Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">
            First Name
          </label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              autoComplete="given-name"
              placeholder="First"
              {...register('firstName')}
              aria-invalid={!!(errors.firstName || serverFields.firstName)}
              className={errCls(inputCompactWithIcon, !!(errors.firstName || serverFields.firstName))}
            />
          </div>
          <FieldError message={errors.firstName?.message ?? serverFields.firstName} />
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">
            Last Name
          </label>
          <div className="relative">
            <input
              type="text"
              autoComplete="family-name"
              placeholder="Last"
              {...register('lastName')}
              aria-invalid={!!(errors.lastName || serverFields.lastName)}
              className={errCls(inputCompact, !!(errors.lastName || serverFields.lastName))}
            />
          </div>
          <FieldError message={errors.lastName?.message ?? serverFields.lastName} />
        </div>
      </div>

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
            className={errCls(inputBase, !!(errors.email || serverFields.email))}
          />
        </div>
        <FieldError message={errors.email?.message ?? serverFields.email} />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">
          Password
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Min. 12 chars · A-Z · a-z · 0-9 · symbol"
            {...register('password')}
            aria-invalid={!!(errors.password || serverFields.password)}
            className={errCls(inputBase, !!(errors.password || serverFields.password))}
          />
        </div>
        <FieldError message={errors.password?.message ?? serverFields.password} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">
          Confirm Password
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
            className={errCls(inputBase, !!errors.confirmPassword)}
          />
        </div>
        <FieldError message={errors.confirmPassword?.message} />
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
          ? <><Loader2 size={15} className="animate-spin" /> Creating account…</>
          : <>Create Account <ArrowRight size={15} /></>}
      </button>

      {/* Divider */}
      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-slate-600 font-medium shrink-0">or</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      <GoogleOAuthButton />

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href={ROUTES.LOGIN} className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
