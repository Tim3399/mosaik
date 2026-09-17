import type { ButtonHTMLAttributes, Ref } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual emphasis. Use `primary` for the one main action of a task area and `secondary`
   * for everything else.
   * @default "secondary"
   */
  variant?: ButtonVariant;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * A native button with the library's styling. It renders no text of its own: the label comes
 * from `children` (or `aria-label` for icon-only content). No client directive is needed, so
 * it can be rendered by Server Components; event handlers require a Client Component parent.
 */
export function Button({
  variant = "secondary",
  type = "button",
  className,
  ref,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      className={className ? `mosaik-button ${className}` : "mosaik-button"}
      data-variant={variant}
    />
  );
}
