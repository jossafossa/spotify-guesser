import { Button, ButtonProps } from "../Button";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type RevealButtonProps = ButtonProps & {
  isVisible?: boolean;
};

export const RevealButton = ({
  isVisible = false,
  ...props
}: RevealButtonProps) => {
  return (
    <Button size="small" type="icon" {...props}>
      {isVisible ? (
        <FontAwesomeIcon icon={faEyeSlash} />
      ) : (
        <FontAwesomeIcon icon={faEye} />
      )}
    </Button>
  );
};
