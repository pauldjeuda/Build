import React, { forwardRef } from 'react';

const base =
  'w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 ' +
  'transition-all duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ' +
  'hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed';

const Input = forwardRef(function Input(
  { label, error, helper, icon, suffix, className = '', id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-slate-400 flex items-center pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            base,
            icon   ? 'pl-9'  : '',
            suffix ? 'pr-14' : '',
            error
              ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500 hover:border-red-400'
              : 'border-slate-200',
          ].join(' ')}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 text-xs font-medium text-slate-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error  && <p className="text-xs text-red-500">{error}</p>}
      {helper && !error && <p className="text-xs text-slate-400">{helper}</p>}
    </div>
  );
});

export default Input;

export const Select = forwardRef(function Select(
  { label, error, children, className = '', id, ...props },
  ref
) {
  const selectId = id || props.name;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={[
          base,
          'appearance-none cursor-pointer',
          error
            ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
            : 'border-slate-200',
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, className = '', id, ...props },
  ref
) {
  const textareaId = id || props.name;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="text-xs font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={[
          base,
          'resize-none leading-relaxed',
          error
            ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
            : 'border-slate-200',
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});
