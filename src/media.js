import { interval } from "d3";

const slider = document.querySelector(".selector");
const currentDate = document.querySelector(".current-date");
const playButton = document.querySelector(".playButton");
const pauseButton = document.querySelector(".pauseButton");

const pauseButtonFunc = (pauseButton, playButton) => {
  pauseButton.style.display = "none";
  playButton.style.display = "flex";
};

const playButtonFunc = (playButton, pauseButton) => {
  playButton.style.display = "none";
  pauseButton.style.display = "flex";
};

export const pauseFunction = (props) => {
  props.clickStore.isPlaying = false;
  props.clickStore.isClicked = true;
  pauseButtonFunc(pauseButton, playButton);
};

export const playFunction = (props) => {
  props.clickStore.isPlaying = true;
  playButtonFunc(playButton, pauseButton);

  const inter = interval(() => {
    if (props.mapByState) {
      if (!document.querySelector(".groups")) {
        inter.stop();
      } else {
        document.querySelector(".groups").innerHTML = "";
      }
    }
    currentDate.textContent = props.dates[props.stateCounter.counter];
    props.stateCounter.counter++;
    slider.value = props.stateCounter.counter;
    props.update(props.stateCounter.counter);
    if (props.stateCounter.counter >= 185) {
      if (props.clickStore.endLoopCount === false) {
        props.clickStore.endLoopCount = true;
      }
      currentDate.textContent = props.dates[props.stateCounter.counter];
      playButton.style.display = "flex";
      pauseButton.style.display = "none";
      props.clickStore.isPlaying = false;
      inter.stop();
      props.stateCounter.counter = 0;
    }
    if (!props.clickStore.isPlaying) inter.stop();
  }, props.animationInterval);
};

export const Animation = (props) => {
  playButton.style.display = "none";
  pauseButton.style.display = "flex";
  const inter = interval(() => {
    if (props.mapByState) {
      if (!document.querySelector(".groups")) {
        inter.stop();
      } else {
        document.querySelector(".groups").innerHTML = "";
      }
    }
    slider.value = props.stateCounter.counter;
    if (props.clickStore.isClicked) inter.stop();
    props.update(props.stateCounter.counter);
    props.stateCounter.counter++;

    currentDate.textContent = props.dates[props.stateCounter.counter];
    if (props.stateCounter.counter >= 185) {
      if (props.clickStore.endLoopCount === false) {
        props.clickStore.endLoopCount = true;
      }
      playButton.style.display = "flex";
      pauseButton.style.display = "none";
      props.clickStore.isPlaying = false;
      inter.stop();
      props.stateCounter.counter = 0;
    }
  }, props.animationInterval);
};

export const stateSliderFunction = (props) => {
  if (props.clickStore.isPlaying) {
    props.clickStore.isPlaying = false;
    pauseButton.style.display = "none";
    playButton.style.display = "flex";
  }
  if (document.querySelector(".groups"))
    document.querySelector(".groups").innerHTML = "";

  props.clickStore.isClicked = true;
  props.update(props.e.target.value);
  currentDate.textContent = props.dates[props.stateCounter.counter];
  props.stateCounter.counter = props.e.target.value;
};

export const sliderFunction = (props) => {
  if (props.clickStore.isPlaying) {
    props.clickStore.isPlaying = false;
    pauseButton.style.display = "none";
    playButton.style.display = "flex";
  }
  props.clickStore.isClicked = true;
  props.update(props.e.target.value);
  currentDate.textContent = props.dates[props.stateCounter.counter];
  props.stateCounter.counter = props.e.target.value;
};
