"use strict";

(function () {
  const map = document.querySelector(`.map`);
  const mapPinMain = document.querySelector(`.map__pin--main`);

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
    window.map.mapPinMain.addEventListener(`mousedown`, function (e) {
      if (e.which === window.card.eventValue.MOUSE_LEFT) {
        activationMap();
        window.pin.showPins();
      }
    });

    window.map.mapPinMain.addEventListener(`keydown`, function (e) {
      if (e.key === window.card.eventValue.KEY_ENTER) {
        activationMap();
        window.pin.showPins();
      }
    });
  };

  window.map = {
    map,
    mapPinMain,
    mapPinEvents,
    mapState: MapState,
    changeDisabledItems,
  };

})();
