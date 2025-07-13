import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  size?: "small" | "medium" | "large";
  type?: "normal" | "icon";
  variant?: "primary" | "secondary" | "positive" | "negative";
};

export const Button = ({
  children,
  className,
  size = "medium",
  type = "normal",
  variant = "primary",
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

  return (
    <button
      {...props}
      className={classNames(
        className,
        styles.button,
        sizeClasses[size],
        typeClasses[type],
        variantClasses[variant]
      )}
      type="button"
    >
      {children}
    </button>
  );
};
