export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-600/20 border-t-indigo-600 animate-spin" />
        <p className="text-sm text-on-surface-variant font-medium">Loading…</p>
      </div>
    </div>
  );
}
