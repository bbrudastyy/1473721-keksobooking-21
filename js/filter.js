"use strict";

(function () {
  const mapFilters = document.querySelector(`.map__filters`);

  const filterType = mapFilters.querySelector(`#housing-type`);
  // const filterPrice = mapFilters.querySelector(`#housing-price`);
  // const filterRooms = mapFilters.querySelector(`#housing-rooms`);
  // const filterGuests = mapFilters.querySelector(`#housing-guests`);
  // const filterFeatures = mapFilters.querySelector(`#housing-features`);

  let typeValue = `any`;
  // let priceValue = `any`;
  // let roomsValue = `any`;
  // let guestsValue = `any`;

  let pins = [];

  const getRank = (pin) => {
    let rank = 0;
    if (pin.offer.type === typeValue) {
      rank += 2;
    }
    // if (pin.offer.price == priceValue) {
    //   rank += 1;
    // }
    // if (pin.offer.rooms == roomsValue) {
    //   rank += 1;
    // }
    // if (pin.offer.guests == guestsValue) {
    //   rank += 1;
    // }
    return rank;
  };

  const updatePins = () => {
    window.card.close();
    window.pin.clear();
    window.pin.show(pins.sort(function (left, right) {
      return getRank(right) - getRank(left);
    }));
  };

  filterType.addEventListener(`change`, function () {
    typeValue = filterType.value;
    updatePins();
  });

  // filterPrice.addEventListener(`change`, function () {
  //   priceValue = filterPrice.value;
  //   updatePins();
  // });

  // filterRooms.addEventListener(`change`, function () {
  //   roomsValue = filterRooms.value;
  //   updatePins();
  // });

  // filterGuests.addEventListener(`change`, function () {
  //   guestsValue = filtefilterGuestsrType.value;
  //   updatePins();
  // });

  const onLoadSuccess = (data) => {
    pins = data;
    updatePins();
  };

  const onLoadError = (error) => {
    throw error;
  };

  const loadData = () => {
    window.load(onLoadSuccess, onLoadError);
  };

  window.filter = {
    pins,
    updatePins,
    loadData
  };

})();
