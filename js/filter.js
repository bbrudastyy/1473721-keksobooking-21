'use strict';

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
    case FilterName.GUESTS:
    case FilterName.ROOMS:
    case FilterName.PRICE:
    case FilterName.FEATURES:
      window.pin.show(getFiltredPins(pins));
      break;
  }
};

const onChange = () => {
  mapFilters.addEventListener(`change`, window.debounce(changeFilter));
};

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

  if (!features.length) {
    return true;
  }

  return features.every((feature) => pin.offer.features.includes(feature));
};

const getArrayFeatures = () => {
  const features = housingFeatures.querySelectorAll(`input[type=checkbox]:checked`);
  return Array.from(features).map((feature) => feature.value);
};

const getIsPinAvaliable = (pin) => {
  return getMatchPin(pin, housingType.value, Filter.TYPE) &&
    getMatchPin(pin, housingPrice.value, Filter.PRICE) &&
    getMatchPin(pin, housingRooms.value, Filter.ROOMS) &&
    getMatchPin(pin, housingGuests.value, Filter.GUESTS) &&
    checkMatchFeatures(pin, getArrayFeatures());
};

const getFiltredPins = (pinsArray) => {
  window.card.hide();
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

const setDefault = () => {
  mapFilters.reset();
};

const onLoadSuccess = (data) => {
  pins = data.slice();
  window.pin.show(getFiltredPins(pins));
};

const onLoadError = (error) => {
  window.customError.show();
  throw error;
};

const loadData = () => {
  window.server.load(onLoadSuccess, onLoadError);
};

window.filter = {
  loadData,
  onChange,
  setDefault
};
