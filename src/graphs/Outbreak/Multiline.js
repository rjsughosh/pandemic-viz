import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import _ from "underscore";

import {
  ALL_CITIES,
  timeParse,
  formatShortDate,
  formatShortDateFromObj,
} from "utils";
import styles from "./Outbreak.module.css";


function Multiline({ data: outbreakData, metric }) {
  const svgRef = useRef();
  const xScale = useRef();
  const yScale = useRef();
  const [focusedCity, setFocusedCity] = useState(null);

  const getData = useCallback(() => {
    return outbreakData.map((item) => ({
      focused: focusedCity === item.city,
      ...item,
    }));
  }, [outbreakData, focusedCity]);

  const drawChart = useCallback(() => {
    const svgElement = d3.select(svgRef.current);
    const width = svgElement.style("width").replace("px", "");
    const height = svgElement.style("height").replace("px", "");

    // Get Data and scale
    const data = getData();
    const getMetric = (item) =>
      metric.mode === "daily" ? item[metric.key] : item.cumulative[metric.key];
    const max = d3.max(
      _.flatten(
        data.map(({ values }) => values.map((value) => getMetric(value)))
      )
    );
    xScale.current = d3
      .scaleTime()
      .domain(d3.extent(data[0].values, (item) => timeParse(item.date)))
      .range([100, width - 200]);
    yScale.current = d3
      .scaleLinear()
      .domain([0, max])
      .range([height - 40, 10]);
    const colorScale = d3
      .scaleOrdinal()
      .domain(ALL_CITIES)
      .range(d3.schemePaired);

    // Draw left axis
    svgElement
      .select(".axisLeft")
      .call(d3.axisLeft(yScale.current).tickSizeOuter(0))
      .call((g) => g.selectAll(".tick").style("font-size", "12px"))
      .attr("transform", "translate(90, 0)");

    // Draw bottom axis
    svgElement
      .select(".axisBottom")
      .call(d3.axisBottom(xScale.current).tickSizeOuter(0))
      .call((g) => g.selectAll(".tick").style("font-size", "12px"))
      .attr("transform", `translate(0, ${height - 30})`);

    // Draw lines
    const drawPath = (item) =>
      d3
        .line()
        .curve(d3.curveBasis)
        .x((value) => xScale.current(timeParse(value.date)))
        .y((value) => yScale.current(getMetric(value)))(item.values);
    const getHighlightColor = (item) =>
      !focusedCity || item.focused ? colorScale(item.city) : "#EEE";
    const getHighlightOpacity = (item) =>
      !focusedCity || item.focused ? 1 : 0.6;

    svgElement
      .select(".lines")
      .selectAll("path")
      .data(data, (item) => item.city)
      .join(
        (enter) => {
          enter
            .append("path")
            .attr("fill", "none")
            .attr("stroke", getHighlightColor)
            .style("opacity", getHighlightOpacity)
            .style("cursor", "pointer")
            .attr("stroke-width", 2)
            .attr("d", drawPath)
            .on("mousemove mouseover", function (event, item) {
              setFocusedCity(item.city);
              const [x1, y1] = d3.pointer(event);
              svgElement
                .select(".lineVertical")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x1)
                .attr("y2", height - 30);
              svgElement
                .select(".lineHorizontal")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", 90)
                .attr("y2", y1);

              svgElement
                .select(".axisLeft")
                .call(
                  d3
                    .axisLeft(yScale.current)
                    .tickSizeOuter(0)
                    .tickValues([yScale.current.invert(y1)])
                )
                .call((g) => g.selectAll(".tick").style("font-size", "12px"));
              svgElement
                .select(".axisBottom")
                .call(
                  d3
                    .axisBottom(xScale.current)
                    .tickSizeOuter(0)
                    .tickFormat(formatShortDate)
                    .tickValues([
                      timeParse(
                        formatShortDateFromObj(xScale.current.invert(x1))
                      ),
                    ])
                )
                .call((g) => g.selectAll(".tick").style("font-size", "12px"));
            })
            .on("mouseout", (event, item) => {
              setFocusedCity(null);

              svgElement
                .select(".lineVertical")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", 0);
              svgElement
                .select(".lineHorizontal")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", 0);
            });
        },
        (update) => {
          update
            .attr("stroke", getHighlightColor)
            .style("opacity", getHighlightOpacity)
            .transition()
            .duration(100)
            .attr("d", drawPath);
        }
      );

    // Legend
    svgElement
      .select(".legend")
      .attr("transform", `translate(${width - 160}, 10)`)
      .selectAll("g")
      .data(data, (item) => item.city)
      .join(
        (enter) => {
          const grp = enter.append("g").style("cursor", "pointer");

          grp
            .append("rect")
            .attr("x", 10)
            .attr("y", (d, i) => i * 30)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", getHighlightColor);

          grp
            .append("text")
            .attr("x", 40)
            .attr("y", (d, i) => i * 30)
            .text((item) => item.city)
            .attr("dominant-baseline", "text-before-edge")
            .style("text-anchor", "start");

          grp.on("mouseover", function (event, item) {
            const cur = d3.select(this);
            cur.select("rect").attr("stroke", "#000").attr("stroke-width", 2);
            if (!item.focused) {
              setFocusedCity(item.city);
            }
          });

          grp.on("mouseout", function (event, item) {
            const cur = d3.select(this);
            cur.select("rect").attr("stroke", "none").attr("stroke-width", 0);
            setFocusedCity(null);
          });
        },
        (update) => {
          update
            .select("rect")
            .attr("fill", getHighlightColor)
            .attr("x", 10)
            .attr("y", (d, i) => i * 30);

          update
            .select("text")
            .attr("x", 40)
            .attr("y", (d, i) => i * 30)
            .text((item) => item.city);
        }
      );
  }, [metric, focusedCity, getData]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div className={styles.chartContainer}>
      <svg width="100%" height="440" ref={svgRef}>
        <g className="lines" />
        <g className="legend" />
        <g className="axisLeft" />
        <g className="axisBottom" />
        <line
          className="lineVertical"
          strokeDasharray="6, 6"
          stroke="#424242"
        />
        <line
          className="lineHorizontal"
          strokeDasharray="6, 6"
          stroke="#424242"
        />
      </svg>
    </div>
  );
}

export default Multiline;
