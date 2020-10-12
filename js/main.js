"use strict";

(function () {


  const mapPinMain = document.querySelector(`.map__pin--main`);

  window.main = {
    mapPinMain
  };


  const loadAd = () => {
    window.form.setPinAddress(window.disabled.MapState.DISABLED);
    window.disabled.changeDisabledItems();
    window.form.addFormValidation();
  };

  window.disabled.mapPinEvents();

  loadAd();


})();
