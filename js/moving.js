"use strict";

const mapPinMain = document.querySelector(`.map__pin--main`);

const MainPinSize = {
  MAIN_PIN_WIDTH: 65,
  MAIN_PIN_HEIGHT: 65,
  MAIN_PIN_NEEDLE: 22
};

const RestrictionCoords = {
  MIN_CORD_Y: 130,
  MAX_CORD_Y: 630,
  MIN_CORD_X: 0,
  MAX_CORD_X: 1201
};

const InitialValuesPinAddress = {
  LEFT: 570,
  TOP: 375
};

const addMainPinEvent = () => {

  mapPinMain.addEventListener(`mousedown`, (e) => {
    e.preventDefault();

    let startCoords = {
      x: e.clientX,
      y: e.clientY
    };

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();

      const shift = {
        x: startCoords.x - moveEvent.clientX,
        y: startCoords.y - moveEvent.clientY
      };

      startCoords = {
        x: moveEvent.clientX,
        y: moveEvent.clientY
      };

      const valueX = mapPinMain.offsetLeft - shift.x;
      const valueY = mapPinMain.offsetTop - shift.y;

      const address = getAddressValue(valueX, valueY);

      if (address.valueY >= RestrictionCoords.MIN_CORD_Y && address.valueY <= RestrictionCoords.MAX_CORD_Y && address.valueX >= RestrictionCoords.MIN_CORD_X && address.valueX <= RestrictionCoords.MAX_CORD_X) {
        mapPinMain.style.left = `${valueX}px`;
        mapPinMain.style.top = `${valueY}px`;
        updateAddress();
      }
    };

    const onMouseUp = (upEvent) => {
      upEvent.preventDefault();

      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  });

  mapPinMain.addEventListener(`mouseup`, (e) => {
    e.preventDefault();
    if (e.which === window.card.eventValue.MOUSE_LEFT) {
      window.map.activate();
    }
  });

  mapPinMain.addEventListener(`keydown`, (e) => {
    if (e.key === window.card.eventValue.KEY_ENTER) {
      window.map.activate();
    }
  });
};

const getAddressValue = (left, top) => {
  const valueX = left + MainPinSize.MAIN_PIN_WIDTH / 2;
  const valueY = top + (!window.map.getIsMapActive() ? MainPinSize.MAIN_PIN_HEIGHT / 2 : MainPinSize.MAIN_PIN_HEIGHT + MainPinSize.MAIN_PIN_NEEDLE);
  return {
    valueX,
    valueY
  };
};

const updateAddress = () => {
  const address = getAddressValue(mapPinMain.offsetLeft, mapPinMain.offsetTop);
  window.form.setAddress(address.valueX, address.valueY);
};

const setDefaultAddress = () => {
  mapPinMain.style.left = `${InitialValuesPinAddress.LEFT}px`;
  mapPinMain.style.top = `${InitialValuesPinAddress.TOP}px`;
  updateAddress();
};

const init = () => {
  updateAddress();
  addMainPinEvent();
};

window.moving = {
  init,
  updateAddress,
  setDefaultAddress
};
