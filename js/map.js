"use strict";

(function () {
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
      // getIsMapActive() ? filter.removeAttribute(`disabled`) : filter.setAttribute(`disabled`, ``);
    });
  };

  const changeDisabledItems = () => {
    changeDisabled(filters);
    changeDisabled([filterFeatures]);
    window.form.changeDisabled(window.form.formFieldset);
  };

  const activateMap = () => {
    window.moving.updateAddress();
    map.classList.remove(`map--faded`);
    window.form.fillingForm.classList.remove(`ad-form--disabled`);
    changeDisabledItems();
  };

  const activate = () => {
    if (isMapActive) {
      return;
    }

    isMapActive = true;
    activateMap();
    window.filter.loadData();
  };

  const deactivateMap = () => {
    window.moving.updateAddress();
    map.classList.add(`map--faded`);
    window.form.fillingForm.classList.add(`ad-form--disabled`);
    changeDisabledItems();
  };

  const deactivate = () => {
    if (!isMapActive) {
      return;
    }

    isMapActive = false;
    deactivateMap();
  };

  window.map = {
    map,
    changeDisabledItems,
    getIsMapActive,
    activate,
    deactivate
  };

})();
