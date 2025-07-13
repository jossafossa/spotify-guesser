import classNames from "classnames";
import { PropsWithChildren } from "react";
import styles from "./Select.module.scss";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({
  children,
  className,
  ...props
}: PropsWithChildren<SelectProps>) => {
  return (
    <select {...props} className={classNames(className, styles.select)}>
      {children}
    </select>
  );
};
