import React, { useState } from "react";
import styled from "styled-components";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import ToggleButtons from "components/ToggleButtons";
import Bubble from "./Bubble";
import Map from "./Map";
import Symptoms from "./Symptoms";
import Timeline from "./Timeline";
import Outbreak from "./Outbreak";
import Fatality from "./Fatality";
import Heatmap from "./Heatmap";

import timeline from "data/timeline.json";
import fatality from "data/fatality.json";
import symptoms from "data/symptoms.json";
import styles from "./graphs.module.css";

const ItemContainer = styled.div`
  border: 1px solid #ddd;
  background: #fff;
  padding: 10px;
  margin: 4px 0;
  min-height: 100px;
  width: 100%;
  height: 100%;
`;

const BubbleItemContainer = styled.div`
  border: 1px solid #ddd;
  position: relative;
  background: #fff;
  min-height: 100px;
  height: 100%;
  margin: 4px 0;
  width: 100%;
`;

function Graphs() {
  const filterData = (data, start, end) => data.slice(start, end);

  const [bubbleData, setBubbleData] = useState(
    filterData(fatality, 0, fatality.length)
  );
  const [fatalityData, setFatalityData] = useState(
    filterData(fatality, 0, fatality.length)
  );
  const [symptomsData, setSymptomsData] = useState(
    filterData(symptoms, 0, symptoms.length)
  );

  const onDateFilter = (start, end) => {
    const filteredBubbleData = filterData(fatality, start, end);
    const filteredFatalityData = filterData(fatality, start, end);
    const filteredSymptomsData = filterData(symptoms, start, end);
    setBubbleData(filteredBubbleData);
    setFatalityData(filteredFatalityData);
    setSymptomsData(filteredSymptomsData);
  };

  const maxTimelineValue = timeline
    .map((item) => item.cities.Karachi.cases)
    .reduce((a, b) => a + b, 0);

  const [symptomMode, setSymptomMode] = useState("body");
  const [bubbleMode, setBubbleMode] = useState("bubble");

  return (
    <div style={{ padding: 16, width: "100%" }} className={styles.body}>
      <Grid container spacing={2}>
        <Grid item md={5}>
          <BubbleItemContainer>
            <div
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                zIndex: 1000,
                display: "flex",
                padding: "8px",
              }}
            >
              <div className={styles.chip}>
                <div>Cases across Cities</div>
              </div>
              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <ToggleButtons
                  option1="bubble"
                  option2="map"
                  value={bubbleMode}
                  onChange={setBubbleMode}
                />
              </Grid>
            </div>
            {bubbleMode === "bubble" ? (
              <Bubble data={bubbleData} max={maxTimelineValue} />
            ) : (
              <Map data={bubbleData} max={maxTimelineValue} />
            )}
          </BubbleItemContainer>
        </Grid>
        <Grid item md={7}>
          <ItemContainer>
            <Grid container>
              <Grid item md={6}>
                <div className={styles.chip}>
                  <div>Patient Symptoms</div>
                </div>
              </Grid>
              <Grid item md={6}>
                <Box
                  display="flex"
                  flexDirection="row-reverse"
                  justify="flex-end"
                  alignItems="baseline"
                >
                  <ToggleButtons
                    option1="body"
                    option2="heatmap"
                    value={symptomMode}
                    onChange={setSymptomMode}
                  />
                </Box>
              </Grid>
            </Grid>
            {symptomMode === "body" ? (
              <Symptoms data={symptomsData} />
            ) : (
              <Heatmap data={symptomsData} />
            )}
          </ItemContainer>
        </Grid>

        <Grid item md={12}>
          <ItemContainer>
            <Timeline data={fatality} onDateFilter={onDateFilter} />
          </ItemContainer>
        </Grid>

        <Grid item md={8}>
          <ItemContainer>
            <Outbreak data={fatalityData} />
          </ItemContainer>
        </Grid>
        <Grid item md={4}>
          <ItemContainer>
            <div className={styles.chip}>
              <div>Patient Recovery</div>
            </div>
            <Fatality data={fatalityData} />
          </ItemContainer>
        </Grid>
      </Grid>
    </div>
  );
}

export default Graphs;
