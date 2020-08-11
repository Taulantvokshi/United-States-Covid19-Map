import {
  select,
  json,
  geoPath,
  zoom,
  event,
  scaleOrdinal,
  range,
  csv,
} from "d3";
import { feature } from "topojson-client";
import { getDateArray } from "../util/dateRange";
import { createDisplayInfo } from "../util/infoBox";
import {
  pauseFunction,
  playFunction,
  sliderFunction,
  Animation,
} from "./media";

const colorGenerator = range(20000).map(
  (_, i) => `rgba(184, 22, 32,${i / 10000})`
);
const scaleColor = scaleOrdinal().domain(range(10000)).range(colorGenerator);
const dates = getDateArray(new Date("2020-01-21"), new Date("2020-07-24"));
export const countyMap = (projection, displayBox, getIter) => {
  const clickStore = {
    isClicked: false,
    isPlaying: true,
    endLoopCount: false,
  };
  const stateCounter = {
    counter: 0,
  };

  const svg = select(".container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");
  //const projection = geoAlbersUsa().scale(1200).translate([600, 300]);
  const pathGenerator = geoPath().projection(projection);
  const group = select("svg").append("g");

  svg.call(
    zoom().on("zoom", (_) => {
      group.attr("transform", event.transform);
    })
  );

  Promise.all([
    json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"),
    json("./data/webMd-Covid-19.json"),
    csv("./data/statelatlong.csv"),
  ])
    .then(([allStates, counties, statesAcronyms]) => {
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
          stateCounter,
          clickStore,
          mapByState: false,
          update,
          dates,
        });
      });

      slider.addEventListener("input", function (e) {
        sliderFunction({
          clickStore,
          stateCounter,
          e,
          update,
          dates,
        });
      });

      const statesMap = feature(allStates, allStates.objects.states);
      const statesG = group.append("g").attr("class", "statesGroup");
      const countyG = group.append("g").attr("class", "countyGroup");
      const textG = group.append("g").attr("class", "textGroup");
      const containerWidth = document.querySelector(".container").clientWidth;
      textG
        .selectAll("text")
        .data(statesAcronyms)
        .enter()
        .append("text")
        .attr("class", "state-numbers")
        .style("font-size", (d) => (containerWidth < 500 ? "5" : "7"))

        .attr("x", (d) => {
          if (d.State === "FL") return projection([-81.760254, 27.994402])[0];
          return projection([d.Longitude, d.Latitude])[0];
        })
        .attr("y", (d) => {
          if (d.State === "FL") return projection([-81.760254, 27.994402])[1];
          return projection([d.Longitude, d.Latitude])[1];
        })
        .text((d) => d.State);

      statesG
        .selectAll("path")
        .data(statesMap.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .style("fill", "#026596");

      const update = () => {
        const paths = countyG.selectAll("path").data(counties, (d) => d.id);
        paths.style("fill", (d) => {
          if (d.properties.covid) {
            return scaleColor(d.properties.covid[stateCounter.counter]);
          }
        });
        paths
          .enter()
          .append("path")
          .attr("d", pathGenerator)
          .style("fill", (d) => {
            if (d.properties.covid) {
              return scaleColor("0");
            } else {
              return "#026596";
            }
          })
          .on("mouseover", function (d) {
            if (!clickStore.isPlaying) {
              select(this).style("stroke", "black").style("stroke-width", 1.3);
              displayBox.style.display = "flex";
              displayBox.style.top =
                containerWidth < 500
                  ? `${event.clientY}px`
                  : `${event.clientY - 30}px`;
              displayBox.style.left = `${event.clientX - 50}px`;
              displayBox.innerHTML = "";
              if (d.properties.covid) {
                const hoverCounty = d.properties.COUNTY_STATE_NAME.split(",");
                let cases, date;
                if (clickStore.endLoopCount) {
                  cases = d.properties.covid[d.properties.covid.length - 1];
                  date = dates[stateCounter.counter - 1];
                } else {
                  cases = d.properties.covid[stateCounter.counter];
                  date = dates[dates.length - 1];
                }

                createDisplayInfo(
                  displayBox,
                  hoverCounty[1].trim(),
                  `county ${hoverCounty[0]}`,
                  `cases ${cases}`,
                  date
                );
              } else {
                createDisplayInfo(displayBox, "No Info");
              }
            }
          })
          .on("mouseout", function (_) {
            if (!clickStore.isPlaying) {
              displayBox.innerHTML = "";
              select(this).style("stroke", "#e4e3e3").style("stroke-width", 0);
              displayBox.style.display = "none";
            }
          });
      };
      Animation({
        mapByState: false,
        animationInterval: 100,
        stateCounter,
        dates,
        clickStore,
        update,
      });
    })
    .catch((err) => {
      console.log("this is an err", err);
    });
};
