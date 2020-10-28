"use strict";

const mapFilters = document.querySelector(`.map__filters`);
const housingType = mapFilters.querySelector(`#housing-type`);
const housingPrice = mapFilters.querySelector(`#housing-price`);
const housingRooms = mapFilters.querySelector(`#housing-rooms`);
const housingGuests = mapFilters.querySelector(`#housing-guests`);
const housingFeatures = mapFilters.querySelector(`#housing-features`);

const MAX_LENGTH = 5;
const ANY_VALUE = `any`;

let pins = [];

const Prices = {
  any: {
    MIN: Number.NEGATIVE_INFINITY,
    MAX: Number.POSITIVE_INFINITY
  },
  middle: {
    MIN: 10000,
    MAX: 50000
  },
  low: {
    MIN: Number.NEGATIVE_INFINITY,
    MAX: 10000
  },
  high: {
    MIN: 50000,
    MAX: Number.POSITIVE_INFINITY
  }
};

const FilterName = {
  TYPE: `housing-type`,
  GUESTS: `housing-guests`,
  ROOMS: `housing-rooms`,
  PRICE: `housing-price`,
  FEATURES: `features`
};

const Filter = {
  TYPE: `type`,
  PRICE: `price`,
  ROOMS: `rooms`,
  GUESTS: `guests`,
  FEATURES: `features`
};

const changeFilter = (e) => {
  switch (e.target.name) {
    case FilterName.TYPE:
      window.pin.show(getFiltredPins(pins));
      break;
    case FilterName.GUESTS:
      window.pin.show(getFiltredPins(pins));

      break;
    case FilterName.ROOMS:
      window.pin.show(getFiltredPins(pins));

      break;
    case FilterName.PRICE:
      window.pin.show(getFiltredPins(pins));

      break;
    case FilterName.FEATURES:
      window.pin.show(getFiltredPins(pins));
      break;
  }
};

mapFilters.addEventListener(`change`, window.debounce(changeFilter));

const getMatchedPin = (pin, value, typeFilter) => {

  if (value === ANY_VALUE) {
    return true;
  }

  switch (typeFilter) {
    case Filter.TYPE:
      return pin.offer.type === value;
    case Filter.PRICE:
      return (pin.offer.price >= Prices[value].MIN && pin.offer.price < Prices[value].MAX);
    case Filter.ROOMS:
      return pin.offer.rooms === parseInt(value, 10);
    case Filter.GUESTS:
      return pin.offer.guests === parseInt(value, 10);
  }

  return false;
};

const pressingFeatures = (filterFeatures) => {
  const features = filterFeatures.querySelectorAll(`input[type=checkbox]`);
  features.forEach((feature) => {
    feature.addEventListener(`click`, () => {
      feature.toggleAttribute(`checked`);
    });
  });
};

const getArrayFeatures = (filterFeatures) => {
  const features = filterFeatures.querySelectorAll(`input[type=checkbox]`);
  let featuresArray = [];
  features.forEach((feature) => {
    if (feature.checked) {
      featuresArray.push(feature.value);
    }
  });
  return featuresArray;
};

pressingFeatures(housingFeatures);

const checkMatchFeatures = (pin, features) => {
  const a = features(housingFeatures);

  if (a.length === 0) {
    return true;
  }

  if (pin.offer.features.some((r) => a.includes(r))) {
    return true;
  } else {
    return false;
  }
};

const getIsPinAvaliable = (pin) => {
  return getMatchedPin(pin, housingType.value, Filter.TYPE) && getMatchedPin(pin, housingPrice.value, Filter.PRICE) && getMatchedPin(pin, housingRooms.value, Filter.ROOMS) && getMatchedPin(pin, housingGuests.value, Filter.GUESTS) && checkMatchFeatures(pin, getArrayFeatures);
};

const getFiltredPins = (pinsArray) => {
  window.card.close();
  window.pin.clear();

  const result = [];

  for (let i = 0; i < pinsArray.length; i++) {
    const pin = pinsArray[i];

    const isPinAvaliable = getIsPinAvaliable(pin);

    if (isPinAvaliable) {
      result.push(pin);
    }


    if (result.length === MAX_LENGTH) {
      break;
    }
  }

  return result;
};

const onLoadSuccess = (data) => {
  pins = data.slice();
  window.pin.show(getFiltredPins(pins));
};

const onLoadError = (error) => {
  throw error;
};

const loadData = () => {
  window.load(onLoadSuccess, onLoadError);
};

window.filter = {
  pins,
  loadData,
  mapFilters,
  housingFeatures
};
