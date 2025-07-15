import { HTMLAttributes, PropsWithChildren } from "react";

type LinkProps = HTMLAttributes<HTMLAnchorElement>;

type SpanProps = HTMLAttributes<HTMLSpanElement>;

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  onClick?: () => void;
};

export type ClickableProps = (LinkProps | ButtonProps | SpanProps) & {
  href?: string;
  disabled?: boolean;
};

function isLinkProps(
  props: PropsWithChildren<ClickableProps>
): props is LinkProps {
  return "href" in props;
}

function isButtonProps(
  props: PropsWithChildren<ClickableProps>
): props is ButtonProps {
  return "onClick" in props;
}

export const Clickable = (props: PropsWithChildren<ClickableProps>) => {
  if (isLinkProps(props)) return <a {...props} target="_blank" />;
  if (isButtonProps(props)) return <button {...props} />;

  return <span {...(props as HTMLAttributes<HTMLSpanElement>)} />;
};
