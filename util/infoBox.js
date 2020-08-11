export const createDisplayInfo = (
  displayBox,
  stateData,
  countyData,
  casesData,
  currentDate
) => {
  const state = document.createElement("h5");
  state.textContent = stateData;
  const county = document.createElement("p");
  county.textContent = countyData;
  const cases = document.createElement("p");
  cases.textContent = casesData;
  const date = document.createElement("p");
  date.textContent = currentDate;

  displayBox.appendChild(state);
  displayBox.appendChild(county);
  displayBox.appendChild(cases);
  displayBox.appendChild(date);
};
