import React, { useRef, useCallback, useEffect, useState } from "react";
import * as d3 from "d3";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";

import BodySketchUpper from "components/BodySketchUpper";
import BodySketchFace from "components/BodySketchFace";
import styles from "./Symptoms.module.css";

const Symptoms = ({ data: symptomsData }) => {
  const [tooltipData, setTooltipData] = useState({
    cases: 1000,
    symptom: "Fever",
  });
  const selectedAges = useSelector((state) => state.ages);
  const selectedCities = useSelector((state) => state.cities);

  const svgBody = useRef();
  const tooltipRef = useRef();

  const getData = useCallback(() => {
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
    const aggregate = (item) =>
      selectedCities
        .map((city) =>
          selectedAges.reduce(
            (a, b) => reduceItem(a, item.cities[city][b]),
            defaultItem
          )
        )
        .reduce(reduceItem, defaultItem);

    return symptomsData.map(aggregate).reduce(reduceItem, defaultItem);
  }, [symptomsData, selectedAges, selectedCities]);

  useEffect(() => {
    const positionsBody = {
      "Abdominal Pain": {
        x: 0.25,
        y: 0.7,
        labelSide: "right",
        labelPosition: { x: 0.45, y: 0.7 },
      },
      "Back Pain": {
        x: 0.2,
        y: 0.6,
        labelSide: "left",
        labelPosition: { x: 0, y: 0.6 },
      },
      Diarrhoea: {
        x: 0.25,
        y: 0.85,
        labelSide: "left",
        labelPosition: { x: 0.0, y: 0.85 },
      },
      Fever: {
        x: 0.28,
        y: 0.2,
        labelSide: "right",
        labelPosition: { x: 0.45, y: 0.2 },
      },
      Rash: {
        x: 0.35,
        y: 0.6,
        labelSide: "right",
        labelPosition: { x: 0.45, y: 0.6 },
      },
      "Bleeding Nose": {
        x: 0.75,
        y: 0.6,
        labelSide: "right",
        labelPosition: { x: 0.85, y: 0.6 },
      },
      Headache: {
        x: 0.75,
        y: 0.25,
        labelSide: "right",
        labelPosition: { x: 0.85, y: 0.25 },
      },
      "Vision Problems": {
        x: 0.7,
        y: 0.43,
        labelSide: "left",
        labelPosition: { x: 0.45, y: 0.43 },
      },
      Vomitting: {
        x: 0.75,
        y: 0.85,
        labelSide: "left",
        labelPosition: { x: 0.45, y: 0.85 },
      },
    };
    const svgElement = d3.select(svgBody.current);
    const width = svgElement.style("width").replace("px", "");
    const height = svgElement.style("height").replace("px", "");

    const tooltip = d3.select(tooltipRef.current);
    const data = getData();
    const max = d3.max(Object.values(data));

    const bodyData = Object.keys(positionsBody).map((symptom) => ({
      x: positionsBody[symptom].x,
      y: positionsBody[symptom].y,
      r: data[symptom],
      labelSide: positionsBody[symptom].labelSide,
      labelPosition: positionsBody[symptom].labelPosition,
      symptom,
    }));
    const radiusScale = d3
      .scalePow()
      .exponent(2)
      .domain([0, max])
      .range([10, 40]);

    svgElement
      .select(".bubbles")
      .selectAll("g")
      .data(bodyData, (item) => item.symptom)
      .join(
        (enter) => {
          const grp = enter.append("g");
          grp
            .append("circle")
            .attr("cx", (d) => d.x * width)
            .attr("cy", (d) => d.y * height)
            .attr("r", (d) => radiusScale(d.r))
            .style("fill", "#FF7F01")
            .style("opacity", 0.65)
            .each(function (d) {
              d.circleRadius = radiusScale(d.r);
            });

          grp
            .style("cursor", "pointer")
            .on("mousemove", function (event, item) {
              tooltip.style("top", event.clientY - 35 + "px");
              tooltip.transition().duration(50).style("visibility", "visible");

              if (item.labelSide === "left") {
                tooltip.style("left", event.clientX + 20 + "px");
                tooltip.style("right", "unset");
              } else {
                tooltip.style(
                  "right",
                  window.innerWidth - event.clientX + 20 + "px"
                );
                tooltip.style("left", "unset");
              }

              setTooltipData({
                cases: item.r,
                symptom: item.symptom,
              });

              let el = d3.select(this);

              el.select("circle").style("opacity", 0.8);
              el.select("line").style("opacity", 1);
              el.select("text").style("opacity", 1);
            })
            .on("mouseout", function () {
              tooltip.transition().duration(50).style("visibility", "hidden");

              let el = d3.select(this);
              el.select("circle").style("opacity", 0.65);
              el.select("line").style("opacity", 0.6);
              el.select("text").style("opacity", 0.6);
            });

          grp
            .append("text")
            .attr("x", (d) => d.labelPosition.x * width)
            .attr("y", (d) => d.labelPosition.y * height)
            .style("alignment-baseline", "middle")
            .style("opacity", 0.6)
            .text((d) => d.symptom)
            .each(function (d) {
              d.width = this.getBBox().width;
            });

          grp
            .append("line")
            .attr("x1", (d) => {
              let x1Pos =
                d.labelSide === "left"
                  ? d.labelPosition.x * width + d.width + 5
                  : d.labelPosition.x * width - 5;
              return x1Pos;
            })
            .attr("y1", (d) => d.labelPosition.y * height)
            .attr("x2", (d) => {
              let x2Pos =
                d.labelSide === "left"
                  ? d.x * width - d.circleRadius - 5
                  : d.x * width + d.circleRadius + 5;
              return x2Pos;
            })
            .attr("y2", (d) => d.y * height)
            .style("stroke", "#000")
            .style("stroke-width", 1)
            .style("opacity", 0.6);
        },
        (update) => {
          update
            .select("circle")
            .transition()
            .duration(300)
            .attr("r", (d) => radiusScale(d.r));
        }
      );
  }, [getData]);

  return (
    <div className={styles.Symptoms}>
      <div style={{ position: "relative" }}>
        <Grid container className={styles.diagram}>
          <Grid item md={6}>
            <svg width="100%" height="350px" viewBox="0 0 12700 17700">
              <BodySketchUpper />
            </svg>
          </Grid>
          <Grid item md={6}>
            <svg width="100%" height="350px" viewBox="0 0 716 615">
              <BodySketchFace />
            </svg>
          </Grid>
        </Grid>
        <svg
          width="100%"
          height="350px"
          ref={svgBody}
          className={styles.diagram}
        >
          <g className="bubbles" />
        </svg>
      </div>

      <div ref={tooltipRef} className={styles.symptoms_tooltip}>
        <div className={styles.symptom}>{tooltipData.symptom}</div>
        <div className={styles.cases}>
          <div className={styles.label}>
            <span className={styles.dot}></span>
            Total Cases
          </div>
          <div>{d3.format(",")(tooltipData.cases)}</div>
        </div>
      </div>
    </div>
  );
};

Symptoms.propTypes = {};

Symptoms.defaultProps = {};

export default Symptoms;
