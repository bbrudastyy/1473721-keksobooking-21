"use strict";

(function () {

  const loadAd = () => {
    window.form.setPinAddress(0, 0);
    window.map.changeDisabledItems();
    window.form.addFormValidation();
  };

  window.map.mapPinEvents();
  window.moving.movingPin();

  loadAd();

})();
