import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { BillingSuccessContent } from './BillingSuccessContent';

export default function BillingSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 size={48} className="animate-spin text-indigo-500" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
          </div>
        }
      >
        <BillingSuccessContent />
      </Suspense>
    </div>
  );
}
