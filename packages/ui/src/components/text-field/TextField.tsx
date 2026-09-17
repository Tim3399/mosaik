import { type InputHTMLAttributes, type ReactNode, type Ref, useId } from "react";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "children"> {
  /** Visible label. Every field needs one; it also provides the accessible name. */
  label: ReactNode;
  /** Help text below the field, linked with `aria-describedby`. */
  description?: ReactNode;
  /**
   * Error message below the field. When set, the input is marked `aria-invalid` and the message
   * is linked with `aria-describedby`. The message text itself carries the meaning, not color.
   */
  error?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

/**
 * A labeled single-line text input with optional description and error message. All texts come
 * from props. `useId` is available in Server Components, so no client directive is needed;
 * controlled usage with `onChange` requires a Client Component parent.
 */
export function TextField({
  label,
  description,
  error,
  id,
  className,
  type = "text",
  ref,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const invalid = error ? true : ariaInvalid;

  return (
    <div
      className={className ? `mosaik-text-field ${className}` : "mosaik-text-field"}
      data-invalid={error ? "" : undefined}
    >
      <label className="mosaik-text-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        {...inputProps}
        ref={ref}
        id={inputId}
        type={type}
        className="mosaik-text-field__input"
        aria-describedby={describedBy}
        aria-invalid={invalid}
      />
      {description ? (
        <p id={descriptionId} className="mosaik-text-field__description">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mosaik-text-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
