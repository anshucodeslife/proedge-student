import React from 'react';

export const Input = ({ label, type = "text", placeholder, name, value, onChange, error }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-lg border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'} focus:ring-2 outline-none transition-all text-slate-600 placeholder:text-slate-400 text-sm`}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
