import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ResultCardProps {
  title: string;
  value?: string | number;
  description?: string;
  items?: string[];
  variant?: 'default' | 'highlight' | 'warning' | 'success';
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  description,
  items,
  variant = 'default',
  className,
}) => {
  return (
    <div
      className={cn(
        'p-8 rounded-3xl border transition-all duration-500 group relative overflow-hidden',
        'bg-zinc-900/40 backdrop-blur-md border-zinc-800/50 hover:border-zinc-700/50',
        variant === 'highlight' && 'border-zinc-700 bg-zinc-800/40 hover:bg-zinc-800/60',
        variant === 'warning' && 'border-red-900/20 bg-red-900/5 hover:bg-red-900/10',
        variant === 'success' && 'border-emerald-900/20 bg-emerald-900/5 hover:bg-emerald-900/10',
        className
      )}
    >
      {/* Animated Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
            {title}
          </h3>
          {value !== undefined && (
            <div className="flex flex-col items-end">
              <span className={cn(
                "text-4xl font-black tracking-tighter",
                typeof value === 'number' && value >= 7 ? 'text-emerald-400' : 
                typeof value === 'number' && value >= 4 ? 'text-yellow-400' : 'text-red-400',
                typeof value === 'string' && 'text-white'
              )}>
                {value}
                {typeof value === 'number' && <span className="text-sm text-zinc-600 ml-1 font-medium">/10</span>}
              </span>
            </div>
          )}
        </div>

        {description && (
          <p className="text-zinc-200 text-xl leading-relaxed mb-6 font-medium tracking-tight">
            {description}
          </p>
        )}

        {items && items.length > 0 && (
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-4 text-zinc-400 group/item">
                <div className={cn(
                  "mt-2 h-1.5 w-1.5 rounded-full shrink-0 transition-all group-hover/item:scale-150",
                  variant === 'success' ? 'bg-emerald-500' : 
                  variant === 'warning' ? 'bg-red-500' : 'bg-zinc-700'
                )} />
                <span className="text-sm md:text-base leading-relaxed group-hover/item:text-zinc-200 transition-colors">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
