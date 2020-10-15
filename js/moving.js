"use strict";

(function () {

  const restrictionCoords = {
    MIN_CORD_X: 43,
    MAX_CORD_X: 543,
    MIN_CORD_Y: window.pin.pinContainer.offsetLeft,
    MAX_CORD_Y: window.pin.pinContainer.offsetWidth - window.map.mapPinMain.offsetWidth
  };

  const movingPin = () => {

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

        let valueX = window.map.mapPinMain.offsetTop - shift.y;
        let valueY = window.map.mapPinMain.offsetLeft - shift.x;

        if (valueX >= restrictionCoords.MIN_CORD_X && valueX <= restrictionCoords.MAX_CORD_X && valueY > restrictionCoords.MIN_CORD_Y - window.form.MainPinSize.MAIN_PIN_WIDTH / 2 && valueY <= restrictionCoords.MAX_CORD_Y + window.form.MainPinSize.MAIN_PIN_WIDTH / 2) {
          window.map.mapPinMain.style.top = `${valueX}px`;
          window.map.mapPinMain.style.left = `${valueY}px`;
          window.form.setPinAddress(valueY, valueX);
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

  window.moving = {
    movingPin
  };

})();
