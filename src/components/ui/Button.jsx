import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "", 
  icon: Icon, 
  isLoading = false,
  type = 'button',
  disabled = false
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], className)}
    >
      {isLoading ? <Loader2 className="animate-spin" size={18} /> : Icon && <Icon size={18} />}
      {children}
    </button>
  );
};
