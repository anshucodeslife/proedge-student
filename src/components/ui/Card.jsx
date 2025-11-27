import React from 'react';
import { cn } from './Button';

export const Card = ({ children, className = "" }) => (
  <div className={cn("bg-white rounded-2xl shadow-sm border border-slate-100", className)}>
    {children}
  </div>
);
