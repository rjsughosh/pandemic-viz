import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Youth from "components/icons/Youth";
import MiddleAge from "components/icons/MiddleAge";
import Adult from "components/icons/Adult";
import Old from "components/icons/Old";
import AgeIcon from "./AgeIcon";
import styles from "./AgeFilter.module.css";

const AgeFilter = () => {
  const ages = useSelector((state) => state.ages);
  const dispatch = useDispatch();

  const handleChange = (event, i) => {
    const newArr = [...ageFilters];

    newArr[i] = !newArr[i];

    if (!newArr.every((i) => !i)) {
      setAgeFilters(newArr);

      const selectedAges = newArr
        .map((d, i) => ageConfig[i].value)
        .filter((d, i) => newArr[i]);
      dispatch({
        type: "CHANGE_AGES",
        ages: selectedAges,
      });
      return "dispatched";
    }
  };
  const ageConfig = [
    { label: "0 - 20", value: "0", icon: Youth },
    { label: "21 - 40", value: "21", icon: Adult },
    { label: "41 - 60", value: "41", icon: MiddleAge },
    { label: "61 - 100", value: "61", icon: Old },
  ];

  const [ageFilters, setAgeFilters] = useState(
    ageConfig.map((item) => ages.findIndex((i) => i === item.value) >= 0)
  );

  const AgeFilters = ageFilters.map((obj, index) => {
    return (
      <AgeIcon
        key={ageConfig[index].value}
        ageItem={ageConfig[index]}
        index={index}
        handleChange={handleChange}
        isChecked={!!obj}
      />
    );
  });
  return <div className={styles.AgeFilter}>{AgeFilters}</div>;
};
AgeFilter.propTypes = {};

AgeFilter.defaultProps = {};

export default AgeFilter;
