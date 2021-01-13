import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { Select } from "react-functional-select";

import ToggleButtons from "components/ToggleButtons";
import Multiline from "./Multiline";
import GalleryView from "./GalleryView";
import styles from "./Outbreak.module.css";


function OutbreakContainer({ data: outbreakData }) {
  const [view, setView] = useState("multiline");

  const metricOptions = [
    { value: "cases", label: "Cases", mode: "daily", key: "cases" },
    {
      value: "cases_cumulative",
      label: "Cases (Cumulative)",
      mode: "cumulative",
      key: "cases",
    },
    { value: "deaths", label: "Deaths", mode: "daily", key: "deaths" },
    {
      value: "deaths_cumulative",
      label: "Deaths (Cumulative)",
      mode: "cumulative",
      key: "deaths",
    },
    {
      value: "fatality",
      label: "Fatality Rate",
      mode: "daily",
      key: "fatality",
    },
  ];
  const [metric, setMetric] = useState(metricOptions[0]);
  const getMetricValue = useCallback((option) => option.value, []);
  const getMetricLabel = useCallback((option) => option.label, []);
  const onMetricChange = useCallback((option) => setMetric(option), [
    setMetric,
  ]);

  const selectedAges = useSelector((state) => state.ages);
  const selectedCities = useSelector((state) => state.cities);

  const getData = () => {
    const aggregate = (city) => {
      let cumulativeCases = 0;
      let cumulativeDeaths = 0;
      const values = outbreakData.map(({ date, cities }) => {
        const cases = selectedAges.reduce(
          (a, b) => a + cities[city][b].cases,
          0
        );
        const deaths = selectedAges.reduce(
          (a, b) => a + cities[city][b].deaths,
          0
        );
        const fatality = deaths > 0 && cases > 0 ? deaths / cases : 0;
        cumulativeCases += cases;
        cumulativeDeaths += deaths;

        return {
          date,
          deaths,
          cases,
          cumulative: {
            cases: cumulativeCases,
            deaths: cumulativeDeaths,
          },
          fatality,
        };
      });

      return {
        city,
        values,
      };
    };

    return selectedCities.map(aggregate);
  };

  const data = getData();

  return (
    <div className={styles.Outbreak}>
      <div className={styles.title_wrap}>
        <div className={styles.chip}>
          <div>Outbreak curve</div>
        </div>

        <div className={styles.flex}>
          <div>
            <strong>Select Metric:</strong>
          </div>
          <div style={{ width: 170, marginLeft: 8 }}>
            <Select
              options={metricOptions}
              isClearable={false}
              isSearchable={false}
              initialValue={metric}
              onOptionChange={onMetricChange}
              getOptionValue={getMetricValue}
              getOptionLabel={getMetricLabel}
              themeConfig={{
                color: {
                  primary: "#136d77",
                },
                control: {
                  boxShadow: "none",
                  focusedBorderColor: "rgba(19, 109, 119, 0.5)",
                },
                menu: {
                  option: {
                    selectedBgColor: "#136d77",
                    focusedBgColor: "#c0f0e6",
                  },
                },
              }}
            />
          </div>
        </div>

        <div>
          <ToggleButtons
            option1="multiline"
            option2="gallery"
            value={view}
            onChange={setView}
          />
        </div>
      </div>
      {view === "multiline" ? (
        <Multiline data={data} metric={metric} />
      ) : (
        <GalleryView data={data} metric={metric} />
      )}
    </div>
  );
}

export default OutbreakContainer;
