import React, { useCallback, useRef, useEffect } from "react";
import * as d3 from "d3";
import _ from "underscore";
import { useSelector } from "react-redux";

import { formatDate } from "utils";
import styles from "./Heatmap.module.css";

function Heatmap({ data: symptomsData }) {
  const svg = useRef();
  const selectedAges = useSelector((state) => state.ages);
  const selectedCities = useSelector((state) => state.cities);

  const reduceItem = (a, b) => ({
    "Abdominal Pain": a["Abdominal Pain"] + b["Abdominal Pain"],
    "Back Pain": a["Back Pain"] + b["Back Pain"],
    "Bleeding Nose": a["Bleeding Nose"] + b["Bleeding Nose"],
    Diarrhoea: a["Diarrhoea"] + b["Diarrhoea"],
    Fever: a["Fever"] + b["Fever"],
    Headache: a["Headache"] + b["Headache"],
    Rash: a["Rash"] + b["Rash"],
    "Vision Problems": a["Vision Problems"] + b["Vision Problems"],
    Vomitting: a["Vomitting"] + b["Vomitting"],
  });
  const defaultItem = {
    "Abdominal Pain": 0,
    "Back Pain": 0,
    "Bleeding Nose": 0,
    Diarrhoea: 0,
    Fever: 0,
    Headache: 0,
    Rash: 0,
    "Vision Problems": 0,
    Vomitting: 0,
  };
  const getData = useCallback(() => {
    const aggregate = (item) => ({
      symptoms: selectedCities
        .map((city) =>
          selectedAges.reduce(
            (a, b) => reduceItem(a, item.cities[city][b]),
            defaultItem
          )
        )
        .reduce(reduceItem, defaultItem),
      date: item.date,
    });

    const symptomsAggregate = symptomsData.map(aggregate);
    return _.flatten(
      symptomsAggregate.map((item) =>
        _.map(item.symptoms, (count, symptom) => ({
          date: item.date,
          count,
          symptom,
        }))
      )
    );
  }, [symptomsData, selectedCities, selectedAges, defaultItem]);

  useEffect(() => {
    const svgElement = d3.select(svg.current);
    const width = svgElement.style("width").replace("px", "");
    const height = svgElement.style("height").replace("px", "");

    // Get Data and scale
    const data = getData();
    const xScale = d3
      .scaleBand()
      .range([120, width - 30])
      .padding(0)
      .domain(symptomsData.map((item) => item.date));
    const yScale = d3
      .scaleBand()
      .range([height - 26, 0])
      .padding(0)
      .domain(Object.keys(defaultItem));
    const colorScale = d3
      .scaleSequential(d3.interpolatePlasma)
      .domain(d3.extent(data, (item) => item.count));

    // Draw left axis
    svgElement
      .select(".axisLeft")
      .call(d3.axisLeft(yScale))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .call((g) => g.selectAll(".tick").style("font-size", "12px"))
      .attr("transform", "translate(100, 0)");

    // Draw bottom axis
    const xDomain = xScale.domain();
    const xTickValues = [
      xDomain[0],
      xDomain[Math.floor(xDomain.length / 2)],
      xDomain[xDomain.length - 1],
    ];
    svgElement
      .select(".axisBottom")
      .call(
        d3.axisBottom(xScale).tickValues(xTickValues).tickFormat(formatDate)
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick").style("font-size", "12px"))
      .attr("transform", `translate(0, ${height - 26})`);

    // Draw heatmap
    const grp = svgElement.select(".heatmap");
    grp
      .selectAll("rect")
      .data(data, (item) => `${item.date}:${item.count}`)
      .join(
        (enter) => {
          enter
            .append("rect")
            .attr("x", (item) => xScale(item.date))
            .attr("y", (item) => yScale(item.symptom))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("stroke", (item) => colorScale(item.count))
            .style("stroke-width", 1)
            .style("fill", (item) => colorScale(item.count))
        },
        (update) => {
          update
            .attr("x", (item) => xScale(item.date))
            .attr("y", (item) => yScale(item.symptom))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("stroke", (item) => colorScale(item.count))
            .style("fill", (item) => colorScale(item.count));
        }
      );
  }, [getData, symptomsData, defaultItem]);

  return (
    <div className={styles.Heatmap}>
      <svg width="100%" height="350px" ref={svg}>
        <g className="heatmap" />
        <g className="axisLeft" />
        <g className="axisBottom" />
      </svg>
    </div>
  );
}

export default Heatmap;
