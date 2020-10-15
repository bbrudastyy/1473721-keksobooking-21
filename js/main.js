"use strict";

(function () {

  const loadAd = () => {
    window.form.setPinAddress(window.map.mapState.DISABLED);
    window.map.changeDisabledItems();
    window.form.addFormValidation();
  };

  window.map.mapPinEvents();
  window.moving.movingPin();

  loadAd();

})();
