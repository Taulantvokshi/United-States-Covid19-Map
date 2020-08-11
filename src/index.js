import { select, geoAlbersUsa } from "d3";
import { countyMap } from "./countyMap";
import { generalMap } from "./generalMap";

const mapGeneral = document.querySelector(".general-btn");
const mapCounty = document.querySelector(".county-btn");

select("body").append("div").attr("class", "infoTab");
const displayBox = document.querySelector(".infoTab");
const container = document.querySelector(".container");

let mapScale = 1100;

if (container.clientHeight === 300) mapScale = 500;
let projection = geoAlbersUsa()
  .scale(mapScale)
  .translate([container.clientWidth / 2, container.clientHeight / 2 - 10]);

mapGeneral.style.backgroundColor = "#026596";
mapGeneral.addEventListener("click", (e) => {
  window.location.reload();
  mapCounty.style.backgroundColor = "#dadada";
  mapGeneral.style.backgroundColor = "#026596";
  container.innerHTML = "";
  generalMap(projection, container);
});

mapCounty.addEventListener("click", (e) => {
  mapGeneral.style.backgroundColor = "#dadada";
  mapCounty.style.backgroundColor = "#026596";
  container.innerHTML = "";
  countyMap(projection, displayBox);
});
//countyMap(displayBox, projection);
generalMap(projection, container);
