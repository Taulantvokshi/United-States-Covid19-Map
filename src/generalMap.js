import { select, json, geoPath, scaleLinear, zoom, event, interval } from "d3";
import { feature } from "topojson-client";
import { getDateArray } from "../util/dateRange";
import {
  pauseFunction,
  playFunction,
  Animation,
  stateSliderFunction,
} from "./media";
const dates = getDateArray(new Date("2020-01-21"), new Date("2020-07-24"));
//State Variables
export const generalMap = (projection, container) => {
  const clickStore = {
    isClicked: false,
    isPlaying: true,
  };
  const stateCounter = {
    counter: 0,
  };

  const svg = select(".container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");

  const pathGenerator = geoPath().projection(projection);
  const group = select("svg").append("g");

  svg.call(
    zoom().on("zoom", (_) => {
      group.attr("transform", event.transform);
    })
  );

  Promise.all([
    json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"),
    json("./data/states-covid19.json"),
  ]).then(([map, statesLonLat]) => {
    //DOM Controll Elements
    const slider = document.querySelector(".selector");

    //DOM Buttons
    const playButton = document.querySelector(".playButton");
    const pauseButton = document.querySelector(".pauseButton");

    pauseButton.addEventListener("click", (e) => {
      pauseFunction({ clickStore });
    });

    playButton.addEventListener("click", (_) => {
      playFunction({
        mapByState: true,
        animationInterval: 100,
        stateCounter,
        clickStore,
        update,
        dates,
      });
    });

    slider.addEventListener("input", function (e) {
      stateSliderFunction({
        clickStore,
        mapByState: true,
        stateCounter,
        e,
        update,
        dates,
      });
    });
    const states = feature(map, map.objects.states);
    const size = scaleLinear().domain([0, 125000]).range([5, 15]);

    group
      .selectAll("path")
      .data(states.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("class", "states");

    const g = group.append("g").attr("class", "groups");

    function update(x) {
      const text = group.selectAll("text").data(statesLonLat);
      const circles = g.selectAll("circle").data(statesLonLat);
      const newText = g.selectAll("text").data(statesLonLat);
      circles
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("r", (d) => {
          return size(d.cases[x]);
        })
        .attr("cx", function (d) {
          return projection([d.longitude, d.latitude])[0];
        })
        .attr("cy", function (d) {
          return projection([d.longitude, d.latitude])[1];
        })

        .attr("r", (d) => {
          return size(d.cases[0]);
        })
        .merge(circles)

        .attr("r", (d) => {
          return size(d.cases[x]);
        });

      newText
        .enter()
        .append("text")
        .attr("class", "state-numbers")

        .attr("x", (d) => {
          return projection([d.longitude, d.latitude])[0];
        })
        .attr("y", (d) => {
          return projection([d.longitude, d.latitude])[1] - 10;
        })
        .merge(newText)
        .style("font-size", container.clientHeight === 400 ? "5px" : "8px")
        .text((d) => {
          return d.cases[x];
        });

      text
        .enter()
        .merge(text)
        .append("text")
        .attr("class", "state-names")
        .style("font-size", container.clientHeight === 400 ? "5px" : "8px")
        .attr("x", (d) => {
          return projection([d.longitude, d.latitude])[0];
        })
        .attr("y", (d) => {
          return projection([d.longitude, d.latitude])[1];
        })
        .text((d) => d.state);
    }
    Animation({
      mapByState: true,
      animationInterval: 100,
      stateCounter,
      dates,
      clickStore,
      update,
    });
  });
};
