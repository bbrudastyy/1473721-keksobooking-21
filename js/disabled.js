"use strict";

(function () {
  const filters = document.querySelectorAll(`.map__filter`);
  const filterFeatures = document.querySelector(`.map__features`);

  const MapState = {
    ACTIVE: `active`,
    DISABLED: `disabled`
  };

  const changeDisabled = (elements) => {
    elements.forEach((filter) => {
      filter.removeAttribute(`disabled`);
    });
  };

  const changeDisabledItems = () => {
    changeDisabled(filters);
    changeDisabled([filterFeatures]);
    changeDisabled(formFieldset);
  };

  const activationMap = () => {
    map.classList.remove(`map--faded`);
    fillingForm.classList.remove(`ad-form--disabled`);
    changeDisabledItems();
    setPinAddress(MapState.ACTIVE);
  };

  const mapPinEvents = () => {
    mapPinMain.addEventListener(`mousedown`, function (e) {
      if (e.which === EventValue.MOUSE_LEFT) {
        activationMap();
        showPins();
        console.log('Работает');
      }
    });

    window.main.mapPinMain.addEventListener(`keydown`, function (e) {
      if (e.key === EventValue.KEY_ENTER) {
        activationMap();
        showPins();
      }
    });
  };

  window.disabled = {
    mapPinEvents: mapPinEvents
  };

})();

