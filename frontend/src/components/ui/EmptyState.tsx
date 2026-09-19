export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-dashed border-border bg-white px-6 py-14 text-center">
      <p className="font-display text-base font-semibold text-navy">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
    </div>
  );
}
