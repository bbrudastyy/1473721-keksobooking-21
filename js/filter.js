"use strict";

const mapFilters = document.querySelector(`.map__filters`);

let pins = [];
let count = 0;

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
  GUESTS: `guests`,
  ROOMS: `rooms`
}

const addObject = (pins) => {
  pins.forEach(pin => {
    pin[`matched`] = 0;
    pin[`matches`] = {
      features: []
    };
  });
};

const changeFilter = (e) => {
  switch (e.target.name) {
    case FilterName.TYPE:
      simpleFilter(Filter.TYPE, e.target.value);
      count++;
      break;
    case FilterName.GUESTS:
      simpleFilter(Filter.GUESTS, e.target.value);
      break;
    case FilterName.ROOMS:
      simpleFilter(Filter.ROOMS, e.target.value);
      break;
    case FilterName.PRICE:
      filterPrice(e.target.value);
      break;
    case FilterName.FEATURES:
      e.target.toggleAttribute(`checked`);
      filterFeatures(e.target);
      break;
  };
};

mapFilters.addEventListener(`change`, window.debounce(changeFilter));

const simpleFilter = (filter, match) => {
  pins.forEach(pin => {
    if (match === `any`) {
      pin[`matches`][filter] = 1;
    } else {
      pin[`matches`][filter] = 0;
      if (pin.offer[filter].toString() === match) {
        pin[`matches`][filter]++;
      }
    }
    getTotalMatch(pin);
  });
  updatePins();
};

const getFinalPins = (pins) => {
  let finalPins = [];
  // let countPin = 0;
  // console.log(count);
  pins.forEach(pin => {
    if (pin[`matched`] === 1) {
      if (finalPins.length < 5) {
        finalPins.push(pin);
      }
    }
  });
  return finalPins;
};

const updatePins = () => {
  console.log(pins);
  window.card.close();
  window.pin.clear();
  pins.sort((a, b) => a.matched < b.matched ? 1 : -1);
  window.pin.show(getFinalPins(pins));
}

const getTotalMatch = (pin) => {
  pin[`matched`] = 0;
  Object.keys(pin[`matches`]).forEach(key => {
    if (key === `features`) {
      if (pin[`matches`][key].length === 0) {
        pin[`matched`] += 1;
      } else {
        pin[`matched`] += pin[`matches`][key].length + 1;
      }
    } else {
      pin[`matched`] += pin[`matches`][key];
    }
  });
};

const filterPrice = (value) => {
  pins.forEach(pin => {
    pin[`matches`][`price`] = 0;
    if (value === `any`) {
      pin[`matches`][`price`] = 1;
    }
    if (pin.offer.price >= Prices[value].MIN && pin.offer.price <= Prices[value].MAX) {
      pin[`matches`][`price`]++;
    }
    getTotalMatch(pin);
  });
  updatePins();
};

const filterFeatures = (target) => {
  pins.forEach(pin => {
    pin.offer.features.forEach(feature => {
      if (feature === target.value) {
        if (target.checked) {
          pin[`matches`][`features`].push(feature);
        } else {
          pin[`matches`][`features`].splice(pin[`matches`][`features`].indexOf(feature), 1);
        }
      }
    });
    getTotalMatch(pin);
  });
  updatePins();
};

const onLoadSuccess = (data) => {
  pins = data.slice();
  addObject(pins);
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
  loadData
};
