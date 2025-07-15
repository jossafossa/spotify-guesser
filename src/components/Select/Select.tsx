import classNames from "classnames";
import { PropsWithChildren } from "react";
import styles from "./Select.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({
  children,
  className,
  ...props
}: PropsWithChildren<SelectProps>) => {
  return (
    <label className={classNames(className, styles.select)}>
      <select {...props}>{children}</select>
      <FontAwesomeIcon className={styles.icon} icon={faCaretDown} />
    </label>
  );
};
