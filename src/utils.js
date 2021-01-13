import moment from "moment";
import * as d3 from "d3";

export const ALL_CITIES = [
  "Aleppo",
  "Colombia",
  "Iran",
  "Karachi",
  "Lebanon",
  "Nairobi",
  "Saudi",
  "Thailand",
  "Turkey",
  "Venezuela",
  "Yemen",
];

export const formatDate = (date) => moment(date, "YYYY-MM-DD").format("ll");
export const formatShortDate = (date) => moment(date, "YYYY-MM-DD").format("MMM D");
export const formatShortDateFromObj = (date) => moment(date).format("YYYY-MM-DD");

export const roundDecimals = (num, n) =>
  Math.round((num + Number.EPSILON) * Math.pow(10, n)) / Math.pow(10, n);

export const timeParse = d3.timeParse("%Y-%m-%d");

export default { ALL_CITIES };
