"use strict";

(function () {
  const filters = document.querySelectorAll(`.map__filter`);
  const filterFeatures = document.querySelector(`.map__features`);

  const MapState = {
    ACTIVE: `active`,
    DISABLED: `disabled`,
    MOVE_PIN: `move`
  };

  const changeDisabled = (elements) => {
    elements.forEach((filter) => {
      filter.removeAttribute(`disabled`);
    });
  };

  const changeDisabledItems = () => {
    changeDisabled(filters);
    changeDisabled([filterFeatures]);
    changeDisabled(window.form.formFieldset);
  };

  const activationMap = () => {
    window.map.map.classList.remove(`map--faded`);
    window.form.fillingForm.classList.remove(`ad-form--disabled`);
    changeDisabledItems();
    window.form.setPinAddress(MapState.ACTIVE);
  };

  const mapPinEvents = () => {
    window.main.mapPinMain.addEventListener(`mousedown`, function (e) {
      if (e.which === window.map.EventValue.MOUSE_LEFT) {
        activationMap();
        window.pin.showPins();
      }
    });

    window.main.mapPinMain.addEventListener(`keydown`, function (e) {
      if (e.key === window.map.EventValue.KEY_ENTER) {
        activationMap();
        window.pin.showPins();
      }
    });
  };

  window.disabled = {
    mapPinEvents,
    MapState,
    changeDisabledItems
  };


})();

