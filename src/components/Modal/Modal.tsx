import { PropsWithChildren, ReactNode, useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import { Button } from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

type ModalProps = {
  onClose?: () => void;
  title?: string;
  footer?: ReactNode;
};

export const Modal = ({
  children,
  title,
  footer,
  onClose,
}: PropsWithChildren<ModalProps>) => {
  const { t } = useTranslation();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialog.current;

    const closeEvent = dialogElement?.addEventListener("close", () =>
      onClose?.()
    );

    dialogElement?.showModal();

    return () => {
      if (closeEvent) dialogElement?.removeEventListener("close", closeEvent);
    };
  }, [dialog, onClose]);

  const handleClose = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialog.current) {
      dialog.current?.close();
    }
  };

  return (
    <dialog ref={dialog} className={styles.modal} onClick={handleClose}>
      <header>
        <h2>{title}</h2>
        <Button autoFocus title={t("close")} type="icon" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </Button>
      </header>
      <section>{children}</section>
      {footer && <footer>{footer}</footer>}
    </dialog>
  );
};
