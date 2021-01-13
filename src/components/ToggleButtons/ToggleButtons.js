import React from "react";
import styles from "./ToggleButtons.module.css";
import classNames from "classnames";
function ToggleButtons({
  option1,
  option2,
  value,
  disableOption1,
  disableOption2,
  onChange,
}) {
  return (
    <div className={styles.buttons_wrap}>
      <div
        onClick={() => {
          !disableOption1 && onChange(option1);
        }}
        className={classNames(styles.each_button, {
          [styles.mouseover]: !disableOption1,
          [styles.selected]: value === option1,
          [styles.disable]: disableOption1,
        })}
      >
        {option1}
      </div>
      <div
        onClick={() => {
          !disableOption2 && onChange(option2);
        }}
        className={classNames(styles.each_button, {
          [styles.mouseover]: !disableOption2,
          [styles.selected]: value === option2,
          [styles.disable]: disableOption2,
        })}
      >
        {option2}
      </div>
    </div>
  );
}

export default ToggleButtons;
