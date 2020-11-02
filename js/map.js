"use strict";

const map = document.querySelector(`.map`);

const filters = document.querySelectorAll(`.map__filter`);
const filterFeatures = document.querySelector(`.map__features`);

let isMapActive = false;

const getIsMapActive = () => {
  return isMapActive;
};

const changeDisabled = (elements) => {
  elements.forEach((filter) => {
    if (getIsMapActive()) {
      filter.removeAttribute(`disabled`);
    } else {
      filter.setAttribute(`disabled`, ``);
    }
  });
};

const changeDisabledItems = () => {
  changeDisabled(filters);
  changeDisabled([filterFeatures]);
  window.form.changeDisabled();
};

const activate = () => {
  window.moving.updateAddress();
  map.classList.remove(`map--faded`);
  window.form.changeMapActive();
  changeDisabledItems();
};

const getStateActive = () => {
  if (isMapActive) {
    return;
  }

  isMapActive = true;
  activate();
  window.filter.loadData();
};

const deactivate = () => {
  window.moving.updateAddress();
  map.classList.add(`map--faded`);
  window.form.changeMapActive();
  changeDisabledItems();
};

const getStateDeactive = () => {
  if (!isMapActive) {
    return;
  }

  isMapActive = false;
  deactivate();
};

window.map = {
  changeDisabledItems,
  getIsMapActive,
  getStateActive,
  getStateDeactive
};
