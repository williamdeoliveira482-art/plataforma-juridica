import { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded border border-border">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="bg-surface text-xs font-medium uppercase tracking-wide text-gray-500">{children}</thead>;
}

export function TRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tr className={`border-t border-border ${className}`}>{children}</tr>;
}

export function TH({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

export function TD({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-graphite ${className}`}>{children}</td>;
}
