import type { Metadata } from 'next';
import { GuestGuard } from '@/shared/auth/guards/GuestGuard';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <GuestGuard>
      <div>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 8 }}>
            Reset your password
          </h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748b', lineHeight: 1.5 }}>
            Enter your email and we&apos;ll send you a reset link instantly
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </GuestGuard>
  );
}
