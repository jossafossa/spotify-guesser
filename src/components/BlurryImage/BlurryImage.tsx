import { ImgHTMLAttributes } from "react";
import styles from "./BlurryImage.module.scss";
import classNames from "classnames";

type BlurryImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  imageclassName?: string;
};

export const BlurryImage = ({
  className,
  imageclassName,
  src,
  alt,
  children,
}: BlurryImageProps) => {
  return (
    <picture className={classNames(className, styles.picture)}>
      <img
        src={src}
        alt={alt}
        className={classNames(imageclassName, styles.image)}
      />
      <img src={src} alt={alt} className={styles.blur} />

      {children}
    </picture>
  );
};
