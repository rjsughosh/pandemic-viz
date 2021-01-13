import React, { useState } from "react";
import classNames from "classnames";

import styles from "./AgeFilter.module.css";

function AgeIcon({ ageItem, index, handleChange, isChecked }) {
  const Icon = ageItem.icon;
  const [fillState, setFillState] = useState(isChecked ? "#006D77" : "#000");

  const ageIconClicked = (ageItem_value, index) => {
    let res = handleChange(ageItem_value, index);
    if (!isChecked || !res) {
      setFillState("#006D77");
    } else {
      setFillState("#000");
    }
  };
  return (
    <div className={classNames(styles.each_age_wrap)}>
      <div
        className={classNames(styles.each_age, {
          [styles.selected]: isChecked,
        })}
        onClick={() => ageIconClicked(ageItem.value, index)}
      >
        <div
          className={classNames(styles.value, {
            [styles.icon_selected]: isChecked,
          })}
        >
          <Icon svgSize="70" fillColor={fillState} />
        </div>
      </div>
    </div>
  );
}

export default AgeIcon;
