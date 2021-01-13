import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import * as d3 from "d3";
import { MapContainer, CircleMarker, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import styles from "./Map.module.css";
import "./leaflet_override.css";

function BubbleMap({ data: mapData, max }) {
  const selectedAges = useSelector((state) => state.ages);
  const selectedCities = useSelector((state) => state.cities);

  const coordinates = {
    Aleppo: [39.5531, 37.8683],
    Colombia: [3.7952, -72.8292],
    Iran: [31.8948, 54.1666],
    Karachi: [25.0248, 67.0778],
    Lebanon: [34.2175, 35.9218],
    Nairobi: [-1.2939, 36.8309],
    Saudi: [23.4835, 44.5553],
    Thailand: [15.9472, 100.8831],
    Turkey: [39.3402, 34.3702],
    Venezuela: [7.1928, -67.0311],
    Yemen: [15.9234, 46.4321],
  };
  const radiusScale = d3
    .scalePow()
    .exponent(2)
    .domain([0, max])
    .range([10, 70]);

  const getData = useCallback(() => {
    const reduceItem = (item, key) =>
      selectedAges.reduce((a, b) => a + item[b][key], 0);
    return selectedCities.map((city) => ({
      city,
      deaths: mapData
        .map((item) => reduceItem(item.cities[city], "deaths"))
        .reduce((a, b) => a + b, 0),
      cases: mapData
        .map((item) => reduceItem(item.cities[city], "cases"))
        .reduce((a, b) => a + b, 0),
      coordinates: coordinates[city],
    }));
  }, [mapData, selectedAges, selectedCities, coordinates]);

  const data = getData();

  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      className={styles.map_container}
      zoom={1.5}
      center={[-0.09, 51.505]}
    >
      <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data.map((city, k) => {
        return (
          <CircleMarker
            color="#149F84"
            key={k}
            center={[city["coordinates"][0], city["coordinates"][1]]}
            radius={radiusScale(city.cases)}
            fillOpacity={0.8}
            stroke={false}
          >
            <Tooltip direction="right" offset={[-8, -2]} opacity={0.9} className={styles.tooltip_container}>
              <div className={styles.bubble_tooltip}>
                <div className={styles.country}>{city.city}</div>
                <div className={styles.cases}>
                  <div className={styles.label}>
                    <span className={styles.blue}></span>
                    Total Cases
                  </div>
                  <div>{d3.format(",")(city.cases)}</div>
                </div>
                <div className={(styles.deaths, styles.cases)}>
                  <div className={styles.label}>
                    <span className={styles.red}></span>
                    Total Deaths
                  </div>
                  <div>{d3.format(",")(city.deaths)}</div>
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export default BubbleMap;
