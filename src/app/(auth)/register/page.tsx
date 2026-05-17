import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { GuestGuard } from '@/shared/auth/guards/GuestGuard';

export const metadata: Metadata = {
  title: 'Create Account',
};

export default function RegisterPage() {
  return (
    <GuestGuard>
      <div>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 8 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748b', lineHeight: 1.5 }}>
            Start your AI-powered English journey — free forever
          </p>
        </div>
        <RegisterForm />
      </div>
    </GuestGuard>
  );
}
