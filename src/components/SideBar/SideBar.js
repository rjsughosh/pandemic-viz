import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedTwoToneIcon from "@material-ui/icons/RadioButtonUncheckedTwoTone";
import _ from "underscore";

import AgeFilter from "components/AgeFilter";
import virusIcon from "assets/icons/virus.svg";
import styles from "./SideBar.module.css";

function SideBar() {
  const cities = useSelector((state) => state.cities);
  const dispatch = useDispatch();
  const [selectedCities, setSelectedCities] = useState(
    cities.map((city) => ({
      city,
      selected: true,
    }))
  );

  const onCitySelect = (idx) => {
    const newSelectedCities = selectedCities.map((item) => _.clone(item));
    newSelectedCities[idx].selected = !newSelectedCities[idx].selected;

    if (!newSelectedCities.every((i) => !i.selected)) {
      setSelectedCities(newSelectedCities);
      dispatch({
        type: "CHANGE_CITIES",
        cities: newSelectedCities
          .filter((item) => item.selected)
          .map((item) => item.city),
      });
    }
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={styles.drawer}
      classes={{
        paper: styles.drawerPaper,
      }}
    >
      <div className={styles.flex}>
        <div className={styles.virus_img}>
          <img src={virusIcon} width="55" alt="Pandemic Virus Icon" />
        </div>
        <div>
          <h1 className={styles.title}>Pandemic Viz</h1>
          <h2 className={styles.subtitle}>VAST 2010 - MC2</h2>
        </div>
      </div>

      <div className={styles.citySelector}>
        <h3 className={styles.h3}>Select Cities</h3>
        {selectedCities.map(({ city, selected }, idx) => (
          <div
            className={styles.cityItem}
            onClick={() => onCitySelect(idx)}
            key={city}
          >
            {selected ? (
              <CheckCircleIcon />
            ) : (
              <RadioButtonUncheckedTwoToneIcon />
            )}
            <span>{city}</span>
          </div>
        ))}
      </div>
      <div className={styles.ageSelector}>
        <h3 className={styles.h3}>Age Groups</h3>
        <AgeFilter />
      </div>
    </Drawer>
  );
}

export default SideBar;
