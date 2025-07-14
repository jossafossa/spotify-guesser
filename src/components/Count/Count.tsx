import { useEffect, useState } from "react";
import styles from "./Count.module.scss";
import classNames from "classnames";

type CountProps = {
  count: number;
  variant?: "primary" | "secondary" | "positive" | "negative";
};

export const Count = ({ count, variant = "primary" }: CountProps) => {
  const [animationClass, setAnimationClass] = useState<string | null>(null);

  const variantClasses = {
    primary: styles.primary,
    secondary: styles.secondary,
    positive: styles.positive,
    negative: styles.negative,
  };

  useEffect(() => {
    setAnimationClass(styles.animate);

    const timeout = setTimeout(() => {
      setAnimationClass(null);
    }, 500);

    console.log("count change");

    return () => clearTimeout(timeout);
  }, [count]);

  return (
    <div
      className={classNames(
        styles.count,
        variantClasses[variant],
        animationClass
      )}
    >
      {count}
    </div>
  );
};
