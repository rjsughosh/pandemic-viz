import * as d3 from "d3";

export const forceSimulateBubbles = (
  width,
  height,
  scale,
  circleNode,
  data,
  xAttr,
  yAttr,
  radiusAttr
) => {
  const simulation = d3
    .forceSimulation()
    .force(
      "center",
      d3
        .forceCenter()
        .x(width / 2)
        .y(height / 2 - 20)
    )
    .force("charge", d3.forceManyBody().strength(1))
    .force(
      "collide",
      d3
        .forceCollide()
        .strength(0.2)
        .radius((item) => scale(item[radiusAttr]) + 3)
        .iterations(1)
    );
  simulation.nodes(data).on("tick", () => {
    circleNode.attr(xAttr, (item) => item.x).attr(yAttr, (item) => item.y);
  });
};
