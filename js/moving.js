"use strict";

(function () {

  const restrictionCoords = {
    MIN_CORD_X: 130,
    MAX_CORD_X: 630,
    MIN_CORD_Y: window.pin.pinContainer.offsetLeft,
    MAX_CORD_Y: window.pin.pinContainer.offsetWidth - window.main.mapPinMain.offsetWidth
  };

  window.main.mapPinMain.addEventListener(`mousedown`, function (e) {
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

      let valueX = window.main.mapPinMain.offsetTop - shift.y;
      let valueY = window.main.mapPinMain.offsetLeft - shift.x;

      if (valueX > restrictionCoords.MIN_CORD_X && valueX < restrictionCoords.MAX_CORD_X && valueY > restrictionCoords.MIN_CORD_Y && valueY < restrictionCoords.MAX_CORD_Y) {
        window.main.mapPinMain.style.top = `${valueX}px`;
        window.main.mapPinMain.style.left = `${valueY}px`;
      }

      window.form.setPinAddress(window.disabled.mapState.MOVE_PIN, valueY, valueX);
      const valueXForm = valueX + window.form.MainPinSize.MAIN_PIN_WIDTH / 2;
      const valueYForm = valueY + window.form.MainPinSize.MAIN_PIN_HEIGHT + window.form.MainPinSize.MAIN_PIN_NEEDLE;
      document.querySelector(`#address`).value = `${valueYForm}, ${valueXForm}`;
    };

    const onMouseUp = (upEvent) => {
      upEvent.preventDefault();

      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  });

})();
