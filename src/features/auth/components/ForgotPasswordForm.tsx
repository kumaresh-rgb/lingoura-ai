'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { forgotPasswordSchema, type ForgotPasswordInput } from '../schemas/auth.schemas';
import { authApi } from '../api/auth.api';
import { parseApiError } from '@/shared/api/error-handler';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/constants/routes';

const inputBase =
  'w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-150 ' +
  'bg-slate-800/60 border text-slate-100 placeholder:text-slate-500 ' +
  'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500';

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setApiError(null);
    try {
      await authApi.forgotPassword(data.email);
      setSentEmail(data.email);
      setSent(true);
    } catch (err) {
      setApiError(parseApiError(err).message);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          {/* Success state */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '32px 24px',
              borderRadius: 20,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={28} color="#10b981" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                Check your inbox
              </p>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#64748b', lineHeight: 1.6 }}>
                We&apos;ve sent a reset link to{' '}
                <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{sentEmail}</span>.
                <br />
                It expires in 15 minutes.
              </p>
            </div>
          </div>

          <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', lineHeight: 1.6 }}>
            Didn&apos;t receive it? Check your spam folder or{' '}
            <button
              onClick={() => setSent(false)}
              style={{ color: '#818cf8', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              try again
            </button>
            .
          </p>

          <Link
            href={ROUTES.LOGIN}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '12px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              transition: 'background 0.15s',
            }}
          >
            <ArrowLeft size={15} />
            Back to Sign In
          </Link>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm font-medium"
              role="alert"
            >
              {apiError}
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                {...register('email')}
                aria-invalid={!!errors.email}
                className={cn(inputBase, errors.email ? 'border-red-500/60' : 'border-white/10')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 ml-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-150 flex items-center justify-center gap-2',
              'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50',
              'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100'
            )}
          >
            {isSubmitting ? (
              <><Loader2 size={15} className="animate-spin" /> Sending…</>
            ) : (
              <>Send Reset Link <ArrowRight size={15} /></>
            )}
          </button>

          <Link
            href={ROUTES.LOGIN}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: '#64748b',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
