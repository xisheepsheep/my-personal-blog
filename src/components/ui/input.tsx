import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-slate-400 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950", className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-32 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-400 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950", className)}
      {...props}
    />
  );
}
