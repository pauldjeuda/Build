import React, { forwardRef } from 'react';

const base =
  'w-full bg-white border rounded-xl px-3 py-2.5 text-sm text-obsidian-900 placeholder-obsidian-300 ' +
  'font-sans transition-all duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:border-gold-400';

const Input = forwardRef(function Input(
  { label, error, helper, icon, suffix, className = '', id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-display font-semibold text-obsidian-600 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-obsidian-300 flex items-center pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            base,
            icon    ? 'pl-10' : '',
            suffix  ? 'pr-16' : '',
            error
              ? 'border-red-400 focus:ring-red-400/60 focus:border-red-400'
              : 'border-[#E8E2D9] hover:border-obsidian-300',
          ].join(' ')}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 text-xs font-display font-medium text-obsidian-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error  && <p className="text-xs text-red-500 font-sans">{error}</p>}
      {helper && !error && <p className="text-xs text-obsidian-400 font-sans">{helper}</p>}
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
        <label
          htmlFor={selectId}
          className="text-xs font-display font-semibold text-obsidian-600 uppercase tracking-wider"
        >
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
            ? 'border-red-400 focus:ring-red-400/60'
            : 'border-[#E8E2D9] hover:border-obsidian-300',
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 font-sans">{error}</p>}
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
        <label
          htmlFor={textareaId}
          className="text-xs font-display font-semibold text-obsidian-600 uppercase tracking-wider"
        >
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
            ? 'border-red-400 focus:ring-red-400/60'
            : 'border-[#E8E2D9] hover:border-obsidian-300',
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-sans">{error}</p>}
    </div>
  );
});
