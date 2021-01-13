import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { roundDecimals } from "utils";
import styles from "./Fatality.module.css";

const Fatality = ({ data: fatalityData }) => {
  const green = "#149F84";
  const red = "#FF5364";
  const squareSize = 25;
  const squareSpacing = 29;
  const [scale, setScale] = useState(0);
  const [mortalityRate, setMortalityRate] = useState(0);
  const selectedAges = useSelector((state) => state.ages);
  const selectedCities = useSelector((state) => state.cities);

  const svgRef = useRef();

  const getData = useCallback(() => {
    const reduceItem = (a, b) => ({
      cases: a.cases + b.cases,
      deaths: a.deaths + b.deaths,
    });
    const defaultItem = {
      cases: 0,
      deaths: 0,
    };

    const aggregate = (item) =>
      selectedCities
        .map((city) =>
          selectedAges.reduce(
            (a, b) => reduceItem(a, item.cities[city][b]),
            defaultItem
          )
        )
        .reduce(reduceItem, defaultItem);

    return fatalityData.map(aggregate).reduce(reduceItem, defaultItem);
  }, [fatalityData, selectedAges, selectedCities]);

  const drawMatrix = useCallback(() => {
    const svgElement = d3.select(svgRef.current);
    const data = getData();

    const percentage = parseInt((data.deaths / data.cases) * 100);
    const mortality_rate = roundDecimals((data.deaths / data.cases) * 100, 2);
    setScale(parseInt(data.cases / 100));
    setMortalityRate(mortality_rate);

    const matrixData = [...Array(100).keys()].map((i) => {
      let local_index = i;
      if (local_index > 9) {
        local_index = local_index % 10;
      }
      const x = local_index * squareSpacing;

      local_index = i;
      if (local_index > 9) {
        local_index = parseInt(local_index / 10);
      } else {
        local_index = 0;
      }
      const y = local_index * squareSpacing;

      let val = 100 - percentage;
      const fill = i >= val ? red : green;

      return {
        x,
        y,
        fill,
      };
    });

    const group = svgElement
      .select(".matrix-container")
      .selectAll("rect")
      .data(matrixData);

    group.join(
      (enter) => {
        enter
          .append("rect")
          .attr("class", "rect")
          .attr("width", squareSize)
          .attr("height", squareSize)
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y)
          .attr("fill", (d) => d.fill);
      },
      (update) => {
        update
          .transition()
          .duration(300)
          .attr("fill", (d) => d.fill);
      }
    );
  }, [getData]);

  useEffect(() => {
    drawMatrix();
  }, [drawMatrix]);

  return (
    <div className={styles.Fatality}>
      <div className={styles.matrix_left}>
        <div className={styles.matrix_description}>
          <div>{roundDecimals(100 - mortalityRate, 2)}%</div>
          <div style={{ fontSize: "1.5rem" }}>of the patients recovered</div>
        </div>

        <div className={styles.matrix_container}>
          <svg height="100%" ref={svgRef}>
            <g className="matrix-container" />
          </svg>
        </div>

        <div className={styles.metadata_legends}>
          <div className={styles.metadata_legend}>
            <div
              style={{ background: green }}
              className={styles.legend_box}
            ></div>
            <div>Recoveries</div>
          </div>
          <div className={styles.metadata_legend}>
            <div
              style={{ background: red }}
              className={styles.legend_box}
            ></div>
            <div>Deaths</div>
          </div>
        </div>

        <div className={styles.metadata_scale}>1 Dot = {d3.format(",")(scale)} cases</div>
      </div>
    </div>
  );
};

Fatality.propTypes = {};

Fatality.defaultProps = {};

export default Fatality;
