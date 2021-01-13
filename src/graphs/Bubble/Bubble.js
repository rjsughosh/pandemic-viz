import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";

import styles from "./Bubble.module.css";
import { forceSimulateBubbles } from "./utils";

const Bubble = ({ data: bubbleData, max }) => {
  const [tooltipData, setTooltipData] = useState({
    city: "Karachi",
    cases: 10000,
    deaths: 310,
  });
  const selectedAges = useSelector((state) => state.ages);
  const selectedCities = useSelector((state) => state.cities);

  const getData = useCallback(() => {
    const reduceItem = (item, key) =>
      selectedAges.reduce((a, b) => a + item[b][key], 0);

    return selectedCities.map((city) => ({
      city,
      deaths: bubbleData
        .map((item) => reduceItem(item.cities[city], "deaths"))
        .reduce((a, b) => a + b, 0),
      cases: bubbleData
        .map((item) => reduceItem(item.cities[city], "cases"))
        .reduce((a, b) => a + b, 0),
    }));
  }, [bubbleData, selectedAges, selectedCities]);
  const svgRef = useRef();
  const tooltipRef = useRef();

  const drawBubbles = useCallback(() => {
    const svgElement = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const width = svgElement.style("width").replace("px", "");
    const height = svgElement.style("height").replace("px", "");
    const data = getData();
    // const casesMax = d3.max(data, item => item.cases);
    const radiusScale = d3.scaleLinear().domain([0, max]).range([26, 100]);

    const circles = svgElement
      .select(".circle-container")
      .selectAll("g")
      .data(data, (item) => item.city);

    circles.join(
      (enter) => {
        const grp = enter.append("g");

        const circleNode = grp
          .append("circle")
          .attr("class", "bubble-circle")
          .attr("r", (item) => radiusScale(item.cases))
          .attr("cx", width / 2)
          .attr("cy", height / 2 - 20)
          .attr("fill", "#149F84")
          .style("opacity", 0.8);

        const textNode = grp
          .append("text")
          .attr("class", "bubble-text")
          .attr("x", width / 2)
          .attr("y", height / 2 - 20)
          .style("fill", "#fff")
          .style("text-anchor", "middle")
          .style("font-size", "13px")
          .style("-webkit-touch-callout", "none")
          .style("-webkit-user-select", "none")
          .style("user-select", "none")
          .style("-moz-user-select", "none")
          .style("-ms-user-select", "none")
          .style("-khtml-user-select", "none")
          .text((item) => item.city);

        grp
          .on("mousemove", (event, item) => {
            tooltip.transition().duration(50).style("visibility", "visible");
            tooltip
              .style("left", event.clientX + 20 + "px")
              .style("top", event.clientY - 35 + "px");

            setTooltipData({
              city: item.city,
              cases: item.cases,
              deaths: item.deaths,
            });
          })
          .on("mouseout", () => {
            tooltip.transition().duration(50).style("visibility", "hidden");
          });

        forceSimulateBubbles(
          width,
          height,
          radiusScale,
          circleNode,
          data,
          "cx",
          "cy",
          "cases"
        );
        forceSimulateBubbles(
          width,
          height,
          radiusScale,
          textNode,
          data,
          "x",
          "y",
          "cases"
        );
      },
      (update) => {
        update.call((update) => {
          const circleNode = update.select("circle");
          const textNode = update.select("text");
          circleNode
            .transition()
            .duration(100)
            .attr("r", (item) => radiusScale(item.cases));

          forceSimulateBubbles(
            width,
            height,
            radiusScale,
            circleNode,
            data,
            "cx",
            "cy"
          );

          forceSimulateBubbles(
            width,
            height,
            radiusScale,
            textNode,
            data,
            "x",
            "y"
          );
        });
      }
    );
  }, [getData, max]);

  useEffect(() => {
    drawBubbles();
  }, [drawBubbles]);

  return (
    <div className={styles.Bubble}>
      <svg width="100%" height="100%" ref={svgRef}>
        <g className="circle-container" />
      </svg>
      <div ref={tooltipRef} className={styles.bubble_tooltip}>
        <div className={styles.country}>{tooltipData.city}</div>
        <div className={styles.cases}>
          <div className={styles.label}>
            <span className={styles.blue}></span>
            Total Cases
          </div>
          <div>{d3.format(",")(tooltipData.cases)}</div>
        </div>
        <div className={(styles.deaths, styles.cases)}>
          <div className={styles.label}>
            <span className={styles.red}></span>
            Total Deaths
          </div>
          <div>{d3.format(",")(tooltipData.deaths)}</div>
        </div>
      </div>
    </div>
  );
};

Bubble.propTypes = {};

Bubble.defaultProps = {};

export default Bubble;
