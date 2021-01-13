import React, { useCallback, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";

import { formatShortDate, formatDate } from "utils";
import styles from "./Timeline.module.css";

const Timeline = ({ data: barData, onDateFilter }) => {
  const svgRef = useRef();
  const [bounds, setBounds] = useState([0, barData.length]);
  const brushRef = useRef();
  const selectedAges = useSelector((state) => state.ages);
  const selectedCities = useSelector((state) => state.cities);

  const isWithinBound = (item, bounds) =>
    item.index >= bounds[0] && item.index < bounds[1];

  const getData = useCallback(() => {
    const aggregate = (item, index) => {
      const count = selectedCities
        .map((city) =>
          selectedAges.reduce((a, b) => a + item.cities[city][b].cases, 0)
        )
        .reduce((a, b) => a + b, 0);

      return {
        date: item.date,
        count,
        index,
      };
    };
    return barData.map(aggregate);
  }, [selectedAges, selectedCities, barData]);

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    const width = svgElement.style("width").replace("px", "");
    const height = svgElement.style("height").replace("px", "");
    const innerHeight = height - 26;

    // Get Data and scale
    const data = getData();
    const xScale = d3
      .scaleBand()
      .range([0, width])
      .padding(0.4)
      .domain(data.map((item) => item.date));
    const yScale = d3
      .scaleLinear()
      .range([innerHeight, 0])
      .domain([0, d3.max(data, (item) => item.count)]);
    const invertXScale = (value) => {
      const step = xScale.step();
      return Math.floor(value / step);
    };

    // Draw bottom axis
    svgElement
      .select(".axisBottom")
      .call(
        d3
          .axisBottom(xScale)
          .tickValues([
            "2009-04-20",
            "2009-05-01",
            "2009-05-15",
            "2009-06-01",
            "2009-06-15",
            "2009-06-25",
          ])
          .tickFormat(formatShortDate)
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick").style("font-size", "12px"))
      .attr("transform", `translate(0, ${innerHeight + 5})`);

    // Draw window selector - D3 Brush
    if (!brushRef.current) {
      const defaultSelection = [xScale(data[8].date), xScale(data[55].date)];
      brushRef.current = d3.brushX().extent([
        [2, 0],
        [width - 2, innerHeight],
      ]);
      const brushGrp = svgElement.select(".brush");

      const handle = svgElement
        .select(".handle")
        .selectAll("rect")
        .attr("x", 0)
        .attr("y", innerHeight / 4)
        .attr("height", innerHeight / 2);

      brushRef.current
        .on("brush", ({ selection }) => {
          let start = invertXScale(selection[0]);
          let end = invertXScale(selection[1]);
          if (start === 0 && end === 0) {
            start = 0;
            end = 1;
          } else if (start === data.length && end === data.length) {
            start = data.length - 1;
            end = data.length;
          }
          setBounds([start, end]);
          handle.attr(
            "transform",
            (d, i) => `translate(${selection[i] - 2}, 0)`
          );
        })
        .on("end", ({ selection }) => {
          if (selection !== null) {
            let start = invertXScale(selection[0]);
            let end = invertXScale(selection[1]);
            if (start === 0 && end === 0) {
              start = 0;
              end = 1;
            } else if (start === data.length && end === data.length) {
              start = data.length - 1;
              end = data.length;
            }
            setBounds([start, end]);
            onDateFilter(start, end);
          } else {
            setBounds([0, data.length]);
            brushGrp.call(brushRef.current.move, [2, width - 2]);
          }
        });

      brushGrp
        .call(brushRef.current)
        .call(brushRef.current.move, defaultSelection)
        .call((g) => g.select(".selection").attr("stroke", "none"));
    }

    // Draw bars
    const grp = svgElement.select(".barGroup");
    const bars = grp.selectAll("rect").data(data, (item) => item.date);

    bars.join(
      (enter) => {
        enter
          .append("rect")
          .style("fill", "#63442d")
          .style("opacity", (item) =>
            isWithinBound(item, bounds) ? 0.85 : 0.3
          )
          .attr("x", (item) => xScale(item.date))
          .attr("y", (item) => yScale(item.count))
          .attr("width", xScale.bandwidth())
          .attr("height", (item) => innerHeight - yScale(item.count));
      },
      (update) => {
        update.call((update) => {
          update
            .style("opacity", (item) =>
              isWithinBound(item, bounds) ? 0.85 : 0.3
            )
            .transition()
            .duration(200)
            .attr("y", (item) => yScale(item.count))
            .attr("height", (item) => innerHeight - yScale(item.count));
        });
      }
    );
  }, [getData, onDateFilter, bounds, brushRef]);

  return (
    <div>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="baseline"
        justifyContent="center"
        marginBottom={1}
      >
        {bounds[0] === bounds[1] - 1 ? (
          <strong>{formatDate(barData[bounds[0]].date)}</strong>
        ) : bounds[0] !== bounds[1] ? (
          <React.Fragment>
            <strong>{formatDate(barData[bounds[0]].date)}</strong>
            &nbsp;&nbsp;&mdash;&nbsp;&nbsp;
            <strong>{formatDate(barData[bounds[1] - 1].date)}</strong>
          </React.Fragment>
        ) : (
          <strong>&nbsp;</strong>
        )}
      </Box>
      <div className={styles.Timeline}>
        <svg width="100%" height="100%" ref={svgRef}>
          <g className="barGroup" />
          <g className="handle">
            <rect fill="#9e9e9e" fillOpacity="1" width="4" x="0" y="0" />
            <rect fill="#9e9e9e" fillOpacity="1" width="4" x="0" y="0" />
          </g>
          <g className="brush" />
          <g className="axisBottom" />
        </svg>
      </div>
    </div>
  );
};

Timeline.propTypes = {};

Timeline.defaultProps = {};

export default Timeline;
