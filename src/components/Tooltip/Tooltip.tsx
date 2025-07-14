import { PropsWithChildren, useRef } from "react";
import styles from "./Tooltip.module.scss";
import { Popover } from "../Popover";
import classNames from "classnames";

type Position = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

const POSITION_CLASSES = new Map<Position, string>([
  ["top", styles.top],
  ["bottom", styles.bottom],
  ["left", styles.left],
  ["right", styles.right],
]);

const ALIGNMENT_CLASSES = new Map<Align, string>([
  ["start", styles.start],
  ["center", styles.center],
  ["end", styles.end],
]);

type TooltipProps = {
  message: string;
  position?: Position;
  align?: Align;
};

export const Tooltip = ({
  children,
  message,
  position = "top",
  align = "center",
}: PropsWithChildren<TooltipProps>) => {
  const anchor = useRef<HTMLDivElement>(null);

  const positionClass = POSITION_CLASSES.get(position);
  const alignClass = ALIGNMENT_CLASSES.get(align);

  return (
    <div className={classNames(styles.tooltipContainer)} ref={anchor}>
      {children}
      <Popover anchor={anchor}>
        <div
          className={classNames(
            styles.tooltipWrapper,
            positionClass,
            alignClass
          )}
        >
          <div className={styles.arrow}></div>
          <div className={styles.tooltip}>{message}</div>
        </div>
      </Popover>
    </div>
  );
};
