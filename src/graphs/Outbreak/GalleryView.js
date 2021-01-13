import React, { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";

import { timeParse } from "utils";
import styles from "./Outbreak.module.css";


function GalleryView({ data: outbreakData, metric }) {
  const containerRef = useRef();

  const drawChart = useCallback(() => {
    const container = d3.select(containerRef.current);
    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;
    const innerWidthEach = width / 4 - 50;
    const innerHeightEach = height / 3 - 50;

    const data = outbreakData;
    const getMetric = (item) =>
      metric.mode === "daily" ? item[metric.key] : item.cumulative[metric.key];

    const getXScale = (item) =>
      d3
        .scaleTime()
        .domain(d3.extent(item.values, (i) => timeParse(i.date)))
        .range([0, innerWidthEach]);
    const getYScale = (item) =>
      d3
        .scaleLinear()
        .domain(d3.extent(item.values, (i) => getMetric(i)))
        .range([innerHeightEach, 0]);

    const drawPath = (item) => {
      const xScale = getXScale(item);
      const yScale = getYScale(item);

      return d3
        .area()
        .curve(d3.curveBasis)
        .x((value) => xScale(timeParse(value.date)))
        .y0(innerHeightEach)
        .y1((value) => yScale(getMetric(value)))(item.values);
    };

    container
      .selectAll("div")
      .data(data, (item) => `${item.city}_${metric.value}`)
      .join(
        (enter) => {
          const div = enter
            .append("div")
            .style("position", "relative")
            .style("border", "1px solid #DDD");

          const svg = div
            .append("svg")
            .attr("width", innerWidthEach)
            .attr("height", innerHeightEach);

          svg
            .append("path")
            .attr("fill", "#FF7F01")
            .attr("fill-opacity", 0.3)
            .attr("stroke", "#FF7F01")
            .attr("stroke-width", 1)
            .attr("d", drawPath);

          svg
            .append("line")
            .style("stroke", "#424242")
            .style("stroke-dasharray", "6, 6")
            .style("stroke-width", 1)
            .style("opacity", 0.8);

          svg.on("mousemove mouseover", function (event, item) {
            const [x1] = d3.pointer(event);
            container
              .selectAll("div")
              .select("line")
              .attr("x1", x1)
              .attr("x2", x1)
              .attr("y1", 0)
              .attr("y2", innerHeightEach);
          });

          svg.on("mouseout", function (event, item) {
            container
              .selectAll("div")
              .select("line")
              .attr("x1", 0)
              .attr("x2", 0)
              .attr("y1", 0)
              .attr("y2", 0);
          });

          div
            .append("div")
            .attr("class", "label")
            .style("position", "absolute")
            .style("bottom", 0)
            .style("left", 0)
            .style("right", 0)
            .style("text-align", "center")
            .style("font-size", "13px")
            .html((item) => item.city);
        },
        (update) => {
          const svg = update.select("svg");

          svg.select("path").transition().duration(100).attr("d", drawPath);

          update
            .append("div")
            .attr("class", "label")
            .style("position", "absolute")
            .style("bottom", 0)
            .style("left", 0)
            .style("right", 0)
            .style("text-align", "center")
            .style("font-size", "13px")
            .html((item) => item.city);

          svg
            .append("line")
            .style("stroke", "#424242")
            .style("stroke-dasharray", "6, 6")
            .style("stroke-width", 1)
            .style("opacity", 0.8);

          svg.on("mousemove mouseover", function (event, item) {
            const [x1] = d3.pointer(event);
            container
              .selectAll("div")
              .select("line")
              .attr("x1", x1)
              .attr("x2", x1)
              .attr("y1", 0)
              .attr("y2", innerHeightEach);
          });

          svg.on("mouseout", function (event, item) {
            container
              .selectAll("div")
              .select("line")
              .attr("x1", 0)
              .attr("x2", 0)
              .attr("y1", 0)
              .attr("y2", 0);
          });
        },
        (exit) => {
          exit.call(exit => exit.remove());
        }
      );
  }, [metric, outbreakData]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div className={styles.galleryContainer}>
      <div style={{ width: "100%", height: "440px" }} ref={containerRef}></div>
    </div>
  );
}

export default GalleryView;
