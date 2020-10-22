"use strict";

(function () {
  const map = document.querySelector(`.map`);
  const mapPinMain = document.querySelector(`.map__pin--main`);

  const filters = document.querySelectorAll(`.map__filter`);
  const filterFeatures = document.querySelector(`.map__features`);

  let isMapActive = false;

  const getIsMapActive = () => {
    return isMapActive;
  }

  const changeDisabled = (elements) => {
    elements.forEach((filter) => {
      getIsMapActive() ? filter.removeAttribute(`disabled`) : filter.setAttribute(`disabled`, ``)
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
    isMapActive = true;
    activateMap();
    window.pin.show();
  };

  const deactivateMap = () => {
    window.moving.updateAddress();
    map.classList.add(`map--faded`);
    window.form.fillingForm.classList.add(`ad-form--disabled`);
    changeDisabledItems();
  };

  const deactivate = () => {
    isMapActive = false;
    deactivateMap();
  };


  const mapPinEvents = () => {
    mapPinMain.addEventListener(`mousedown`, function (e) {
      if (e.which === window.card.eventValue.MOUSE_LEFT) {
        activate();
      }
    });

    mapPinMain.addEventListener(`keydown`, function (e) {
      if (e.key === window.card.eventValue.KEY_ENTER) {
        activate();
      }
    });
  };

  window.map = {
    map,
    mapPinMain,
    mapPinEvents,
    changeDisabledItems,
    getIsMapActive,
    deactivate
  };

})();
