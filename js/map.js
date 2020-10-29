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
  window.form.changeDisabled(window.form.formFieldset);
};

const activate = () => {
  window.moving.updateAddress();
  map.classList.remove(`map--faded`);
  window.form.fillingForm.classList.remove(`ad-form--disabled`);
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
  window.form.fillingForm.classList.add(`ad-form--disabled`);
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
  map,
  changeDisabledItems,
  getIsMapActive,
  getStateActive,
  getStateDeactive
};
