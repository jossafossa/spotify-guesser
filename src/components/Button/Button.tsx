import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";
import { Tooltip } from "../Tooltip";

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  size?: "small" | "medium" | "large";
  type?: "normal" | "icon";
  variant?: "primary" | "secondary" | "positive" | "negative";
  tooltip?: string;
};

export const Button = ({
  children,
  className,
  size = "medium",
  type = "normal",
  variant = "primary",
  disabled = false,
  tooltip,
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  const typeClasses = {
    normal: styles.normal,
    round: styles.round,
    icon: styles.icon,
  };

  const variantClasses = {
    primary: styles.primary,
    secondary: styles.secondary,
    positive: styles.positive,
    negative: styles.negative,
  };

  const button = (
    <button
      {...props}
      disabled={disabled}
      className={classNames(
        className,
        styles.button,
        sizeClasses[size],
        typeClasses[type],
        variantClasses[variant],
        disabled && styles.disabled
      )}
      type="button"
    >
      {children}
    </button>
  );

  return tooltip ? (
    <Tooltip message={tooltip} position="top">
      {button}
    </Tooltip>
  ) : (
    button
  );
};
