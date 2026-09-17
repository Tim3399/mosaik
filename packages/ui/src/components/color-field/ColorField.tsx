"use client";

import { type ChangeEvent, type ReactNode, useId, useState } from "react";
import { normalizeHexColor } from "../../foundations/color.js";

export interface ColorFieldProps {
  /** Visible label. It also names both the text input and the color picker. */
  label: ReactNode;
  /** Current color as `#rrggbb` for controlled use; pair it with `onChange`. */
  value?: string;
  /**
   * Initial color as `#rrggbb` for uncontrolled use, for example in a form rendered by a Server
   * Component.
   * @default "#000000"
   */
  defaultValue?: string;
  /** Called with a normalized lowercase `#rrggbb` whenever the user enters a valid color. */
  onChange?: (value: string) => void;
  /** Help text below the field, linked with `aria-describedby`. */
  description?: ReactNode;
  /**
   * Accessible name suffix for the picker, combined with the label.
   * @default "Pick color"
   */
  pickerLabel?: string;
  disabled?: boolean;
  id?: string;
  /** Form field name; the submitted value is the text input's content. */
  name?: string;
  className?: string;
}

/**
 * A color input: a native color picker plus a hex text field that accepts `#rrggbb`.
 * Partial or invalid text is kept while typing and never reported; on blur it returns to the
 * last valid color. It keeps a draft in state, so the module is a Client Component. Without
 * function props it can be rendered directly by a Server Component.
 */
export function ColorField({
  label,
  value,
  defaultValue = "#000000",
  onChange,
  description,
  pickerLabel = "Pick color",
  disabled,
  id,
  name,
  className,
}: ColorFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const pickerLabelId = `${inputId}-picker-label`;
  const descriptionId = description ? `${inputId}-description` : undefined;

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const committed = isControlled ? value : uncontrolledValue;

  const [draft, setDraft] = useState(committed);
  const [syncedValue, setSyncedValue] = useState(committed);
  if (committed !== syncedValue) {
    // Adopt a new committed color, unless the draft already spells the same color.
    setSyncedValue(committed);
    if (normalizeHexColor(draft) !== committed) setDraft(committed);
  }

  function commit(candidate: string) {
    const normalized = normalizeHexColor(candidate);
    if (!normalized || normalized === committed) return;
    if (!isControlled) setUncontrolledValue(normalized);
    onChange?.(normalized);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.target.value);
    commit(event.target.value);
  }

  function handleBlur() {
    setDraft(normalizeHexColor(draft) ?? committed);
  }

  return (
    <div className={className ? `mosaik-color-field ${className}` : "mosaik-color-field"}>
      <label id={labelId} className="mosaik-color-field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="mosaik-color-field__control">
        <input
          type="color"
          className="mosaik-color-field__picker"
          value={normalizeHexColor(committed) ?? "#000000"}
          onChange={handleChange}
          disabled={disabled}
          aria-labelledby={`${labelId} ${pickerLabelId}`}
          aria-describedby={descriptionId}
        />
        <span id={pickerLabelId} className="mosaik-visually-hidden">
          {pickerLabel}
        </span>
        <input
          id={inputId}
          name={name}
          type="text"
          className="mosaik-color-field__input"
          value={draft}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          maxLength={7}
          aria-describedby={descriptionId}
        />
      </div>
      {description ? (
        <p id={descriptionId} className="mosaik-color-field__description">
          {description}
        </p>
      ) : null}
    </div>
  );
}
