import { PropsWithChildren, useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import { Button } from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faClose } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Stack } from "../Stack";

type ModalProps = {
  onClose?: () => void;
  title?: string;
};

export const Modal = ({
  children,
  title,
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
      <section>
        <p>{children}</p>
      </section>
      <footer>
        <Stack gap="small" align="center">
          <Button
            href="https://github.com/jossafossa/spotify-guesser"
            variant="secondary"
            type="icon"
            title="GitHub Repository"
          >
            <FontAwesomeIcon icon={faGithub} />
          </Button>

          <Button
            href="https://www.jossafossa.nl"
            variant="secondary"
            type="icon"
            title={t("author")}
          >
            <FontAwesomeIcon icon={faAt} />
          </Button>
        </Stack>
      </footer>
    </dialog>
  );
};
