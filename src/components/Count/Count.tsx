import { PropsWithChildren } from "react";
import styles from "./Count.module.scss";
import classNames from "classnames";

type CountProps = {
  variant?: "primary" | "secondary" | "positive" | "negative";
};

export const Count = ({
  children,
  variant = "primary",
}: PropsWithChildren<CountProps>) => {
  const variantClasses = {
    primary: styles.primary,
    secondary: styles.secondary,
    positive: styles.positive,
    negative: styles.negative,
  };

  return (
    <div className={classNames(styles.count, variantClasses[variant])}>
      {children}
    </div>
  );
};
