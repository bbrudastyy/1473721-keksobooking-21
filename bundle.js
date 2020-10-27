/******/ (() => { // webpackBootstrap
(() => {
"use strict";
/*!********************!*\
  !*** ./js/load.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const URL = ` https://21.javascript.pages.academy/keksobooking/data`;

const TIMEOUT_STATUS = 10000;

const StatusCode = {
  OK: 200,
  BAD: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
};

window.load = (onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, function () {
    let error = ``;

    switch (xhr.status) {
      case StatusCode.OK:
        onSuccess(xhr.response);
        break;
      case StatusCode.BAD:
        error = `Неверный запрос`;
        break;
      case StatusCode.UNAUTHORIZED:
        error = `Пользователь не авторизован`;
        break;
      case StatusCode.NOT_FOUND:
        error = `Ничего не найдено`;
        break;

      default:
        error = `Cтатус ответа: ${xhr.status} ${xhr.statusText}`;
    }

    if (error) {
      onError(error);
    }
  });

  xhr.addEventListener(`error`, function () {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, function () {
    onError(`Запрос не успел выполниться за ${xhr.timeout}мс`);
  });

  xhr.timeout = TIMEOUT_STATUS;

  xhr.open(`GET`, URL);
  xhr.send();
};

})();

(() => {
"use strict";
/*!************************!*\
  !*** ./js/debounce.js ***!
  \************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEBOUNCE_INTERVAL = 500;

window.debounce = function (cb) {
  let lastTimeout = null;

  return function (...parameters) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      cb(...parameters);
    }, DEBOUNCE_INTERVAL);
  };
};

})();

(() => {
"use strict";
/*!********************!*\
  !*** ./js/card.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);
const cardPhotoTemplate = document.querySelector(`#card`).content.querySelector(`.popup__photo`);

const RoomType = {
  FLAT: `flat`,
  BUNGALOW: `bungalow`,
  HOUSE: `house`,
  PALACE: `palace`
};

const RoomTypeValue = {
  [RoomType.FLAT]: `Квартира`,
  [RoomType.BUNGALOW]: `Бунгало`,
  [RoomType.HOUSE]: `Дом`,
  [RoomType.PALACE]: `Дворец`
};

const EventValue = {
  MOUSE_LEFT: 1,
  KEY_ENTER: `Enter`,
  KEY_ESCAPE: `Escape`,
  KEY_ESCAPE_ABBREVIATED: `Esc`
};

let card = null;

const addCloseCardEvent = (cardElement) => {
  cardElement.querySelector(`.popup__close`).addEventListener(`click`, function () {
    close();
  });

  document.addEventListener(`keydown`, function (e) {
    if (e.key === EventValue.KEY_ESCAPE || e.key === EventValue.KEY_ESCAPE_ABBREVIATED) {
      e.preventDefault();
      close();
    }
  });
};

const close = () => {
  if (card !== null) {
    card.remove();
    card = null;
  }
};

const show = (pin) => {
  close();
  card = getItemCard(pin);
  const mapFilter = document.querySelector(`.map__filters-container`);
  const mapFilterParent = mapFilter.parentNode;
  mapFilterParent.insertBefore(card, mapFilter);
  addCloseCardEvent(card);
};

const renderFeatures = (container, features) => {
  if (!features.length) {
    container.remove();
    return;
  }

  container.innerHTML = ``;

  for (let i = 0; i < features.length; i++) {
    let element;
    element = document.createElement(`li`);
    element.className = `popup__feature popup__feature--${features[i]}`;
    container.appendChild(element);
  }
};

const renderPhotos = (container, photos) => {
  if (!photos.length) {
    container.remove();
    return;
  }

  container.removeChild(container.querySelector(`.popup__photo`));

  for (let i = 0; i < photos.length; i++) {
    let element;
    element = cardPhotoTemplate.cloneNode(true);
    element.src = photos[i];
    container.appendChild(element);
  }
};

const getItemCard = (room) => {

  const cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector(`.popup__avatar`).src = room.author.avatar;
  cardElement.querySelector(`.popup__title`).textContent = room.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = room.offer.address;
  cardElement.querySelector(`.popup__text--price`).textContent = `${room.offer.price}₽/ночь`;
  cardElement.querySelector(`.popup__type`).textContent = RoomTypeValue[room.offer.type];
  cardElement.querySelector(`.popup__text--capacity`).textContent = `${room.offer.rooms} комнат для  ${room.offer.guests} гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${room.offer.checkin}, выезд до ${room.offer.checkout}`;
  cardElement.querySelector(`.popup__description`).textContent = room.offer.description;
  renderFeatures(cardElement.querySelector(`.popup__features`), room.offer.features);
  renderPhotos(cardElement.querySelector(`.popup__photos`), room.offer.photos);

  return cardElement;
};

window.card = {
  roomType: RoomType,
  show,
  close,
  card,
  eventValue: EventValue
};


})();

(() => {
"use strict";
/*!**********************!*\
  !*** ./js/filter.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


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

})();

(() => {
"use strict";
/*!*******************!*\
  !*** ./js/map.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const map = document.querySelector(`.map`);

const filters = document.querySelectorAll(`.map__filter`);
const filterFeatures = document.querySelector(`.map__features`);

let isMapActive = false;

const getIsMapActive = () => {
  return isMapActive;
};

const changeDisabled = (elements) => {
  elements.forEach((filter) => {
    if (getIsMapActive()) {
      filter.removeAttribute(`disabled`);
    } else {
      filter.setAttribute(`disabled`, ``);
    }
    // getIsMapActive() ? filter.removeAttribute(`disabled`) : filter.setAttribute(`disabled`, ``);
  });
};

const changeDisabledItems = () => {
  changeDisabled(filters);
  changeDisabled([filterFeatures]);
  window.form.changeDisabled(window.form.formFieldset);
};

const activateMap = () => {
  window.moving.updateAddress();
  map.classList.remove(`map--faded`);
  window.form.fillingForm.classList.remove(`ad-form--disabled`);
  changeDisabledItems();
};

const activate = () => {
  if (isMapActive) {
    return;
  }

  isMapActive = true;
  activateMap();
  window.filter.loadData();
};

const deactivateMap = () => {
  window.moving.updateAddress();
  map.classList.add(`map--faded`);
  window.form.fillingForm.classList.add(`ad-form--disabled`);
  changeDisabledItems();
};

const deactivate = () => {
  if (!isMapActive) {
    return;
  }

  isMapActive = false;
  deactivateMap();
};

window.map = {
  map,
  changeDisabledItems,
  getIsMapActive,
  activate,
  deactivate
};

})();

(() => {
"use strict";
/*!*******************!*\
  !*** ./js/pin.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let pins = [];

const PinSize = {
  PIN_WIDTH: 40,
  PIN_HEIGHT: 40
};

const MAX_ROOMS_LENGTH = 5;

const pinContainer = document.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

const addPinEvent = (room, pinElement) => {
  pinElement.addEventListener(`click`, function (evt) {
    if (evt.target.classList.contains(`map__pin--main`)) {
      return;
    }

    window.card.show(room);
  });
};

const getPin = (room) => {
  const pinElement = pinTemplate.cloneNode(true);
  pinElement.setAttribute(`style`, `left: ${room.location.x - PinSize.PIN_WIDTH / 2}px; top: ${room.location.y - PinSize.PIN_HEIGHT}px`);
  pinElement.querySelector(`img`).src = room.author.avatar;
  pinElement.querySelector(`img`).alt = room.offer.title;

  return pinElement;
};

const getPins = (rooms) => {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < rooms.length; i++) {
    // for (let i = 0; i < MAX_ROOMS_LENGTH; i++) {
    const room = rooms[i];
    const pinElement = getPin(room);

    pins.push(pinElement);

    addPinEvent(room, pinElement);

    fragment.appendChild(pinElement);
  }
  return fragment;
};

const show = (data) => {
  pinContainer.appendChild(getPins(data));
};

const clear = () => {
  pins.forEach(function (pin) {
    pin.remove();
  });

  pins = [];
};


window.pin = {
  show,
  clear,
  pinContainer
};

})();

(() => {
"use strict";
/*!**********************!*\
  !*** ./js/upload.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const URL = `https://21.javascript.pages.academy/keksobooking`;

const StatusCode = {
  OK: 200,
  BAD: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
};

const TIMEOUT_STATUS = 10000;

window.upload = (data, onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, function () {
    let error = ``;

    switch (xhr.status) {
      case StatusCode.OK:
        onSuccess(xhr.response);
        break;
      case StatusCode.BAD:
        error = `Неверный запрос`;
        break;
      case StatusCode.UNAUTHORIZED:
        error = `Пользователь не авторизован`;
        break;
      case StatusCode.NOT_FOUND:
        error = `Ничего не найдено`;
        break;

      default:
        error = `Cтатус ответа: ${xhr.status} ${xhr.statusText}`;
    }

    if (error) {
      onError(error);
    }
  });

  xhr.addEventListener(`error`, function () {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, function () {
    onError(`Запрос не успел выполниться за ${xhr.timeout}мс`);
  });

  xhr.timeout = TIMEOUT_STATUS;

  xhr.open(`POST`, URL);
  xhr.send(data);
};

})();

(() => {
"use strict";
/*!********************!*\
  !*** ./js/form.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const fillingForm = document.querySelector(`.ad-form`);
const formFieldset = fillingForm.querySelectorAll(`fieldset`);
const formReset = fillingForm.querySelector(`.ad-form__reset`);
const formMessageOk = document.querySelector(`#success`).content.querySelector(`.success`);
const formMessageError = document.querySelector(`#error`).content.querySelector(`.error`);

const main = document.querySelector(`main`);

const FormValue = {
  MIN_TITLE_LENGTH: 30,
  MAX_TITLE_LENGTH: 100
};

const RoomValue = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  HUNDRED: 100
};

const CapacityValue = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  NOT_GUESTS: 0
};

const PriceValue = {
  ZERO: 0,
  ONE_THOUSAND: 1000,
  FIVE_THOUSAND: 5000,
  TEN_THOUSAND: 10000,
  MORE: 1000000
};

const typePriceValue = {
  [window.card.roomType.FLAT]: PriceValue.ONE_THOUSAND,
  [window.card.roomType.BUNGALOW]: PriceValue.ZERO,
  [window.card.roomType.HOUSE]: PriceValue.FIVE_THOUSAND,
  [window.card.roomType.PALACE]: PriceValue.TEN_THOUSAND,
};

const roomCapacityValues = {
  [RoomValue.ONE]: [CapacityValue.ONE],
  [RoomValue.TWO]: [CapacityValue.ONE, CapacityValue.TWO],
  [RoomValue.THREE]: [CapacityValue.ONE, CapacityValue.TWO, CapacityValue.THREE],
  [RoomValue.HUNDRED]: [CapacityValue.NOT_GUESTS],
};

const setAddress = (valueX, valueY) => {
  document.querySelector(`#address`).value = `${Math.floor(valueX)}, ${Math.floor(valueY)}`;
};

const isRoomValid = (roomValue, capacityValue) => {
  return roomCapacityValues[roomValue].includes(capacityValue);
};

const validateRoom = (roomElement, capacityElement) => {
  let message = ``;

  const roomValue = parseInt(roomElement.value, 10);
  const capacityValue = parseInt(capacityElement.value, 10);

  if (!isRoomValid(roomValue, capacityValue)) {
    message = `Неверное кол-во гостей`;
  }

  roomElement.setCustomValidity(message);
  fillingForm.reportValidity();
};

const validateTitle = (element) => {
  element.addEventListener(`invalid`, function () {
    if (element.validity.valueMissing) {
      element.setCustomValidity(`Обязательное поле`);
    } else {
      element.setCustomValidity(``);
    }
  });

  element.addEventListener(`input`, function () {
    const valueLength = element.value.length;

    if (valueLength < FormValue.MIN_TITLE_LENGTH) {
      element.setCustomValidity(`Ещё ${FormValue.MIN_TITLE_LENGTH - valueLength} симв.`);
    } else if (valueLength > FormValue.MAX_TITLE_LENGTH) {
      element.setCustomValidity(`Удалите лишние ${valueLength - FormValue.MAX_TITLE_LENGTH} симв.`);
    } else {
      element.setCustomValidity(``);
    }
  });
  fillingForm.reportValidity();
};

const validateType = (typeElement, priceElement) => {
  let message = ``;

  const priceValue = parseInt(priceElement.value, 10);
  let dictionaryVar = typeElement.value.toUpperCase();

  const isPriceValid = (typeValuePrice, price) => {
    return price >= typeValuePrice;
  };

  if (!isPriceValid(typePriceValue[window.card.roomType[dictionaryVar]], priceValue)) {
    message = `Ожидалась цена выше ${typePriceValue[window.card.roomType[dictionaryVar]]}`;
  }

  if (priceElement.value > PriceValue.MORE) {
    message = `Максимальная цена за жилье 100000 (1 миллион)`;
  } else if (priceElement.value < PriceValue.ZERO) {
    message = `Ожидалась положительная цена`;
  }

  priceElement.setCustomValidity(message);
  fillingForm.reportValidity();
};

const changePlaceholder = (typeElement, priceElement) => {
  const placeholder = typePriceValue[window.card.roomType[typeElement.value.toUpperCase()]];
  priceElement.placeholder = placeholder;
};

const syncTime = (firstTime, secondTime) => {
  secondTime.value = firstTime.value;
  fillingForm.reportValidity();
};

const changeDisabled = (elements) => {
  elements.forEach((filter) => {
    if (window.map.getIsMapActive()) {
      filter.removeAttribute(`disabled`);
    } else {
      filter.setAttribute(`disabled`, ``);
    }
    // window.map.getIsMapActive() ? filter.removeAttribute(`disabled`) : filter.setAttribute(`disabled`, ``);
  });
};

const addFormValidation = () => {
  const roomElement = fillingForm.querySelector(`#room_number`);
  const capacityElement = fillingForm.querySelector(`#capacity`);
  const titleElement = fillingForm.querySelector(`#title`);
  const typeElement = fillingForm.querySelector(`#type`);
  const priceElement = fillingForm.querySelector(`#price`);
  const addressElement = fillingForm.querySelector(`#address`);
  addressElement.setAttribute(`readonly`, ``);
  const timeInElement = fillingForm.querySelector(`#timein`);
  const timeOutElement = fillingForm.querySelector(`#timeout`);
  validateTitle(titleElement);
  changePlaceholder(typeElement, priceElement);
  validateRoom(roomElement, capacityElement);

  fillingForm.addEventListener(`change`, function (e) {
    switch (e.target.id) {
      case roomElement.id:
        validateRoom(roomElement, capacityElement);
        break;
      case priceElement.id:
        validateType(typeElement, priceElement);
        break;
      case typeElement.id:
        validateType(typeElement, priceElement);
        changePlaceholder(typeElement, priceElement);
        break;
      case timeInElement.id:
        syncTime(timeInElement, timeOutElement);
        break;
      case timeOutElement.id:
        syncTime(timeOutElement, timeInElement);
        break;
    }
  });
};

const showMessage = (message) => {
  main.appendChild(message);
};

const removePopupOk = () => {
  document.addEventListener(`keydown`, function (e) {
    if (formMessageOk) {
      if (e.key === window.card.eventValue.KEY_ESCAPE || e.key === window.card.eventValue.KEY_ESCAPE_ABBREVIATED) {
        e.preventDefault();
        main.removeChild(formMessageOk);
      }
    }
  });
};

const removePopupError = () => {
  const errorButton = document.querySelector(`.error__button`);
  if (formMessageError) {
    const remove = (e) => {
      e.preventDefault();
      if (e.key === window.card.eventValue.KEY_ESCAPE || e.key === window.card.eventValue.KEY_ESCAPE_ABBREVIATED || e.which === window.card.eventValue.MOUSE_LEFT) {
        main.removeChild(formMessageError);
        errorButton.removeEventListener(`mousedown`, remove);
        document.removeEventListener(`click`, remove);
        document.removeEventListener(`keydown`, remove);
      }
    };

    document.addEventListener(`keydown`, remove);
    errorButton.addEventListener(`mousedown`, remove);
    document.addEventListener(`click`, remove);
  }
};

const onError = (error) => {
  showMessage(formMessageError);
  removePopupError();
  throw error;
};

const setDefault = () => {
  window.pin.clear();
  window.map.deactivate();
  fillingForm.reset();
  window.moving.setDefaultAddress();
};

const onSuccess = () => {
  setDefault();
  showMessage(formMessageOk);
  removePopupOk();
};

fillingForm.addEventListener(`submit`, function (e) {
  e.preventDefault();

  window.upload(new FormData(fillingForm), onSuccess, onError);
});

formReset.addEventListener(`click`, function () {
  setDefault();
});

window.form = {
  setAddress,
  fillingForm,
  formFieldset,
  addFormValidation,
  changeDisabled
};

})();

(() => {
/*!*********************!*\
  !*** ./js/photo.js ***!
  \*********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

const fileChooserPin = document.querySelector(`.ad-form__field input[type=file]`);
const previewPin = document.querySelector(`.ad-form-header__preview img`);

const fileChooserAd = document.querySelector(`.ad-form__field input[type=file]`);
const previewAd = document.querySelector(`.ad-form__upload img`);
console.log(previewAd);

fileChooserPin.addEventListener(`change`, () => {
  const file = fileChooserPin.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, function () {
      previewPin.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});

fileChooserAd.addEventListener(`change`, () => {
  const file = fileChooserAd.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, function () {
      previewAd.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});

})();

(() => {
"use strict";
/*!**********************!*\
  !*** ./js/moving.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const mapPinMain = document.querySelector(`.map__pin--main`);

const MainPinSize = {
  MAIN_PIN_WIDTH: 65,
  MAIN_PIN_HEIGHT: 65,
  MAIN_PIN_NEEDLE: 22
};

const RestrictionCoords = {
  MIN_CORD_Y: 130,
  MAX_CORD_Y: 630,
  MIN_CORD_X: 0,
  MAX_CORD_X: 1201
};

const InitialValuesPinAddress = {
  LEFT: 570,
  TOP: 375
};

const addMainPinEvent = () => {

  mapPinMain.addEventListener(`mousedown`, function (e) {
    e.preventDefault();

    if (e.which === window.card.eventValue.MOUSE_LEFT) {
      window.map.activate();
    }

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

      const valueX = mapPinMain.offsetLeft - shift.x;
      const valueY = mapPinMain.offsetTop - shift.y;

      const address = getAddressValue(valueX, valueY);

      if (address.valueY >= RestrictionCoords.MIN_CORD_Y && address.valueY <= RestrictionCoords.MAX_CORD_Y && address.valueX >= RestrictionCoords.MIN_CORD_X && address.valueX <= RestrictionCoords.MAX_CORD_X) {
        mapPinMain.style.left = `${valueX}px`;
        mapPinMain.style.top = `${valueY}px`;
        updateAddress();
      }
    };

    const onMouseUp = (upEvent) => {
      upEvent.preventDefault();

      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  });

  mapPinMain.addEventListener(`keydown`, function (e) {
    if (e.key === window.card.eventValue.KEY_ENTER) {
      window.map.activate();
    }
  });

};

const getAddressValue = (left, top) => {
  const valueX = left + MainPinSize.MAIN_PIN_WIDTH / 2;
  const valueY = top + (!window.map.getIsMapActive() ? MainPinSize.MAIN_PIN_HEIGHT / 2 : MainPinSize.MAIN_PIN_HEIGHT + MainPinSize.MAIN_PIN_NEEDLE);
  return { valueX, valueY };
};

const updateAddress = () => {
  const address = getAddressValue(mapPinMain.offsetLeft, mapPinMain.offsetTop);
  window.form.setAddress(address.valueX, address.valueY);
};

const setDefaultAddress = () => {
  mapPinMain.style.left = `${InitialValuesPinAddress.LEFT}px`;
  mapPinMain.style.top = `${InitialValuesPinAddress.TOP}px`;
  updateAddress();
};

const init = () => {
  updateAddress();
  addMainPinEvent();
};

window.moving = {
  init,
  updateAddress,
  setDefaultAddress
};

})();

(() => {
"use strict";
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


window.moving.init();
window.map.changeDisabledItems();
window.form.addFormValidation();

})();

/******/ })()
;