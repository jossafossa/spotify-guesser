import { PropsWithChildren, RefObject } from "react";
import { Portal } from "../Portal";
import styles from "./Popover.module.scss";

type PopoverProps = {
  anchor?: RefObject<HTMLElement>;
};

export const Popover = ({
  children,
  anchor,
}: PropsWithChildren<PopoverProps>) => {
  const rect = anchor?.current?.getBoundingClientRect();
  if (!rect) return;

  const { top, left, width, height } = rect;

  const style = {
    top,
    left,
    width,
    height,
  };

  return (
    <Portal>
      <div className={styles.popover} style={style}>
        {children}
      </div>
    </Portal>
  );
};
