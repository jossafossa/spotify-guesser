import classNames from "classnames";
import styles from "./Button.module.scss";
import { Tooltip } from "../Tooltip";
import { Clickable, ClickableProps } from "../Clickable";

export type ButtonProps = ClickableProps & {
  size?: "small" | "medium" | "large";
  type?: "normal" | "icon";
  variant?: "primary" | "secondary" | "positive" | "negative";
  tooltip?: string;
};

export const Button = (props: ButtonProps) => {
  const {
    className,
    size = "medium",
    type = "normal",
    variant = "primary",
    tooltip,
    children,
  } = props;

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
    <Clickable
      {...props}
      className={classNames(
        className,
        styles.button,
        sizeClasses[size],
        typeClasses[type],
        variantClasses[variant]
      )}
    >
      {children}
    </Clickable>
  );

  return tooltip ? (
    <Tooltip message={tooltip} position="top">
      {button}
    </Tooltip>
  ) : (
    button
  );
};
