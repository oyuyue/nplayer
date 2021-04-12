import clsx from "clsx";
import styles from "./styles.module.css";
import { FaGithub } from "react-icons/all";
import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const QuickSocialLinksView = (props) => {
  const { className } = props;
  const { siteConfig } = useDocusaurusContext();

  return (
    <div className={clsx(className, styles.IconContainer)}>
      <FaGithub
        className={styles.Icon}
        onClick={() => {
          window.open('https://github.com/woopen/rplayer', "_blank");
        }}
      />
    </div>
  );
};

export default QuickSocialLinksView;
