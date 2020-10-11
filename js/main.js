"use strict";

(function () {


  const mapPinMain = document.querySelector(`.map__pin--main`);

  const loadAd = () => {
    setPinAddress(MapState.DISABLED);
    changeDisabledItems();
    addFormValidation();
  };

  window.disabled.mapPinEvents();

  loadAd();

  window.main = {
    mapPinMain: mapPinMain
  };
})();
