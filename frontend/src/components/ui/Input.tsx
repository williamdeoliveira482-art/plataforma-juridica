import { InputHTMLAttributes, forwardRef, LabelHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`focus-ring w-full rounded-sm border border-border bg-white px-3 py-2 text-sm text-graphite placeholder:text-gray-400 ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="mb-1 block text-xs font-medium text-gray-600" {...props} />;
}

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`focus-ring w-full rounded-sm border border-border bg-white px-3 py-2 text-sm text-graphite ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`focus-ring w-full rounded-sm border border-border bg-white px-3 py-2 text-sm text-graphite ${className}`}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
