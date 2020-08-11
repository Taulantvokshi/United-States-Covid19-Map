export const pauseButtonFunc = (pauseButton, playButton) => {
  pauseButton.style.display = "none";
  playButton.style.display = "flex";
};

export const playButtonFunc = (playButton, pauseButton) => {
  playButton.style.display = "none";
  pauseButton.style.display = "flex";
};
