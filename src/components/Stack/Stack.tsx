import classNames from "classnames";
import styles from "./Stack.module.scss";
import { PropsWithChildren } from "react";

type StackProps = {
  vertical?: boolean;
  horizontal?: boolean;
  gap?: "small" | "medium" | "large";
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end" | "between" | "around";
};

export const Stack = ({
  vertical,
  horizontal = true,
  gap = "medium",
  children,
  align = "start",
  justify = "start",
}: PropsWithChildren<StackProps>) => {
  return (
    <div
      className={classNames(
        styles.stack,
        vertical && styles.vertical,
        horizontal && styles.horizontal,
        styles[`gap-${gap}`]
      )}
      style={{
        alignItems: align,
        justifyContent: justify,
      }}
    >
      {children}
    </div>
  );
};
