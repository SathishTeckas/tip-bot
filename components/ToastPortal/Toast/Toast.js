import { useMemo, useEffect } from "react";
import styles from "./styles.module.css";
import error from "../../../public/error.svg";
import Image from "next/image";

export const Toast = ({ mode, onClose, message }) => {
  const classes = useMemo(() => [styles.toast, styles[mode]].join(" "), [mode]);

  useEffect(() => {
    console.log(mode);
  }, [mode]);

  return (
    <div onClick={onClose} className={classes}>
      <div>
        <Image
          alt="Icon"
          width={30}
          height={30}
          src={
            mode == "error"
              ? error
              : mode == "warning"
              ? "/warning.svg"
              : mode == "info"
              ? "/info.svg"
              : mode == "success"
              ? "/success.svg"
              : null
          }
        />
      </div>
      <div className="ml-5">{message}</div>
    </div>
  );
};
