"use strict";

const MAX_LENGTH = 5;
const ANY_VALUE = `any`;

const mapFilters = document.querySelector(`.map__filters`);
const housingType = mapFilters.querySelector(`#housing-type`);
const housingPrice = mapFilters.querySelector(`#housing-price`);
const housingRooms = mapFilters.querySelector(`#housing-rooms`);
const housingGuests = mapFilters.querySelector(`#housing-guests`);
const housingFeatures = mapFilters.querySelector(`#housing-features`);

let pins = [];

const pricesValueTranslate = {
  any: {
    min: Number.NEGATIVE_INFINITY,
    max: Number.POSITIVE_INFINITY
  },
  middle: {
    min: 10000,
    max: 50000
  },
  low: {
    min: Number.NEGATIVE_INFINITY,
    max: 10000
  },
  high: {
    min: 50000,
    max: Number.POSITIVE_INFINITY
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

const changeFilter = (evt) => {
  switch (evt.target.name) {
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

const getMatchPin = (pin, value, typeFilter) => {

  if (value === ANY_VALUE) {
    return true;
  }

  switch (typeFilter) {
    case Filter.TYPE:
      return pin.offer.type === value;
    case Filter.PRICE:
      return (pin.offer.price >= pricesValueTranslate[value].min && pin.offer.price < pricesValueTranslate[value].max);
    case Filter.ROOMS:
      return pin.offer.rooms === parseInt(value, 10);
    case Filter.GUESTS:
      return pin.offer.guests === parseInt(value, 10);
  }

  return false;
};

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

const getIsPinAvaliable = (pin) => {
  return getMatchPin(pin, housingType.value, Filter.TYPE) && getMatchPin(pin, housingPrice.value, Filter.PRICE) && getMatchPin(pin, housingRooms.value, Filter.ROOMS) && getMatchPin(pin, housingGuests.value, Filter.GUESTS) && checkMatchFeatures(pin, getArrayFeatures);
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
