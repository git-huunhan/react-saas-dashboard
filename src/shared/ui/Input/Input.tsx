import "./Input.css";

import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`input ${error ? "input-error" : ""}`}
        {...props}
      />

      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
}
