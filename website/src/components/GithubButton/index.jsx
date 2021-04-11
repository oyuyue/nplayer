import React from "react";
import { FaGithub } from "react-icons/all";
import { useHistory } from "react-router-dom";
import styles from "./styles.module.css";
import clsx from "clsx";

const GithubButton = (props) => {
  const { to, className } = props;
  const history = useHistory();

  return (
    <button
      className={clsx(styles.ButtonContainer, className)}
      onClick={() => {
        if (to.startsWith("http")) {
          window.open(to, "_blank");
          return;
        }
        history.push(to);
      }}
    >
      <FaGithub className={styles.GithubIcon} />
      <div>GITHUB</div>
    </button>
  );
};

export default GithubButton;