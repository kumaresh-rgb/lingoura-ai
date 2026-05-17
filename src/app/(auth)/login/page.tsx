import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { GuestGuard } from '@/shared/auth/guards/GuestGuard';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function LoginPage() {
  return (
    <GuestGuard>
      <div>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#64748b', lineHeight: 1.5 }}>
            Continue your IELTS journey with Lingoura AI
          </p>
        </div>
        <LoginForm />
      </div>
    </GuestGuard>
  );
}
