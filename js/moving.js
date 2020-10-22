"use strict";

(function () {

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
    LEFT: 571,
    TOP: 375
  };

  const addMainPinEvent = () => {

    window.map.mapPinMain.addEventListener(`mousedown`, function (e) {
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

        const valueX = window.map.mapPinMain.offsetLeft - shift.x;
        const valueY = window.map.mapPinMain.offsetTop - shift.y;

        const address = getAddressValue(valueX, valueY);

        if (address.valueY >= RestrictionCoords.MIN_CORD_Y && address.valueY <= RestrictionCoords.MAX_CORD_Y && address.valueX >= RestrictionCoords.MIN_CORD_X && address.valueX <= RestrictionCoords.MAX_CORD_X) {
          window.map.mapPinMain.style.left = `${valueX}px`;
          window.map.mapPinMain.style.top = `${valueY}px`;
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
  };

  const getAddressValue = (left, top) => {
      const valueX = left + MainPinSize.MAIN_PIN_WIDTH / 2;
      const valueY = top + (!window.map.getIsMapActive() ? MainPinSize.MAIN_PIN_HEIGHT / 2 : MainPinSize.MAIN_PIN_HEIGHT + MainPinSize.MAIN_PIN_NEEDLE);
      return { valueX, valueY };
  };

  const updateAddress = () => {
    const address = getAddressValue(window.map.mapPinMain.offsetLeft, window.map.mapPinMain.offsetTop);
    window.form.setAddress(address.valueX, address.valueY);
  };

  const setDefaultAddress = () => {
    window.map.mapPinMain.style.left = `${InitialValuesPinAddress.LEFT}px`;
    window.map.mapPinMain.style.top = `${InitialValuesPinAddress.TOP}px`;
    updateAddress();
  }

  const init = () => {
    updateAddress();
    addMainPinEvent();
  };

  window.moving = {
    init,
    updateAddress,
    setDefaultAddress
  };

})();
